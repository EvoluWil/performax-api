import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  CompanyClient,
  CompanyFinance,
  CompanyFiscalConfig,
  FinanceFlowEnum,
  FinanceStatusEnum,
  Prisma,
  ServiceInvoiceSourceEnum,
  ServiceInvoiceStatusEnum,
} from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MailService } from 'src/providers/mail/mail.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { SpedyService } from 'src/providers/spedy/spedy.service';
import { SpedyServiceInvoiceResponse } from 'src/providers/spedy/types/spedy.types';
import {
  getClientFiscalMissingFields,
  getCompanyFiscalStatus,
} from 'src/utils/fiscal-completeness.util';

type EligibleFinance = CompanyFinance & { client: CompanyClient | null };

export type IssuePeriod = {
  periodStart: Date;
  periodEnd: Date;
  financeStatus?: FinanceStatusEnum;
  clientIds?: string[];
};

@Injectable()
export class ServiceInvoiceService {
  private readonly logger = new Logger(ServiceInvoiceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly spedy: SpedyService,
    private readonly mail: MailService,
  ) {}

  async list(
    companyId: string,
    periodStart: Date,
    periodEnd: Date,
    invoiceStatus?: string,
    financeStatus?: FinanceStatusEnum,
  ) {
    const config = await this.prisma.companyFiscalConfig.findUnique({
      where: { companyId },
    });
    const fiscal = getCompanyFiscalStatus(config);
    const blocker = !fiscal.readyForEmission
      ? 'Cadastro fiscal incompleto, emissor não habilitado ou certificado pendente'
      : null;

    const finances = await this.loadFinances(companyId, {
      periodStart,
      periodEnd,
      financeStatus,
    });
    const invoices = await this.prisma.companyServiceInvoice.findMany({
      where: {
        companyId,
        periodStart: { gte: periodStart },
        periodEnd: { lte: periodEnd },
      },
      orderBy: { createdAt: 'desc' },
    });

    const byClient = new Map<string, EligibleFinance[]>();
    for (const finance of finances) {
      if (!finance.clientId) continue;
      const list = byClient.get(finance.clientId) ?? [];
      list.push(finance);
      byClient.set(finance.clientId, list);
    }

    const rows = [...byClient.entries()].map(([clientId, items]) => {
      const client = items[0].client!;
      const uninvoiced = items.filter((item) => !item.serviceInvoiceId);
      const amount = uninvoiced.reduce((sum, item) => sum + item.value, 0);
      const missing = getClientFiscalMissingFields(client).filter(
        (field) => field !== 'e-mail',
      );
      const clientInvoices = invoices.filter((item) => item.clientId === clientId);
      const latest = clientInvoices[0] ?? null;
      const reason = missing.length
        ? `Cadastro do cliente incompleto: ${missing.join(', ')}`
        : !client.email
          ? 'Cliente sem e-mail'
          : null;
      const canIssue = !blocker && !missing.length && amount > 0;

      return {
        clientId,
        clientName: client.name,
        email: client.email,
        amount,
        financeCount: uninvoiced.length,
        canIssue,
        reason: canIssue ? null : reason,
        missingEmail: !client.email,
        invoiceStatus: latest?.status ?? null,
        invoice: latest,
        finances: items.map((item) => ({
          id: item.id,
          title: item.title,
          date: item.date,
          value: item.value,
          status: item.status,
          invoiced: !!item.serviceInvoiceId,
        })),
      };
    });

    const filtered = invoiceStatus
      ? rows.filter((row) =>
          invoiceStatus === 'NONE'
            ? !row.invoiceStatus && row.financeCount > 0
            : row.invoiceStatus === invoiceStatus,
        )
      : rows;

    return {
      readyForEmission: fiscal.readyForEmission,
      blocker,
      rows: filtered.sort((a, b) => a.clientName.localeCompare(b.clientName)),
    };
  }

  async issueOne(
    companyId: string,
    clientId: string,
    period: IssuePeriod,
    source: ServiceInvoiceSourceEnum,
  ) {
    const result = await this.issueClient(companyId, clientId, period, source);
    return result;
  }

  async issueBatch(companyId: string, period: IssuePeriod) {
    const preview = await this.list(
      companyId,
      period.periodStart,
      period.periodEnd,
      undefined,
      period.financeStatus,
    );
    if (preview.blocker) {
      throw new BadRequestException(preview.blocker);
    }

    const issued = [];
    const skipped = [];
    const selected = new Set(period.clientIds ?? []);
    for (const row of preview.rows) {
      if (selected.size && !selected.has(row.clientId)) {
        continue;
      }
      if (!row.canIssue || row.missingEmail) {
        skipped.push({
          clientId: row.clientId,
          clientName: row.clientName,
          reason: row.missingEmail ? 'Cliente sem e-mail' : row.reason,
        });
        continue;
      }
      try {
        const invoice = await this.issueClient(
          companyId,
          row.clientId,
          period,
          ServiceInvoiceSourceEnum.BATCH,
        );
        issued.push(invoice);
      } catch (err) {
        skipped.push({
          clientId: row.clientId,
          clientName: row.clientName,
          reason: err instanceof Error ? err.message : 'Falha ao emitir',
        });
      }
    }

    return { issued, skipped };
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async refreshProcessing() {
    const pending = await this.prisma.companyServiceInvoice.findMany({
      where: { status: ServiceInvoiceStatusEnum.PROCESSING, providerId: { not: null } },
      include: { client: true, company: true },
    });

    for (const invoice of pending) {
      const config = await this.prisma.companyFiscalConfig.findUnique({
        where: { companyId: invoice.companyId },
      });
      if (!config?.spedyApiKey || !invoice.providerId) continue;
      try {
        const remote = await this.spedy.getServiceInvoice(
          invoice.providerId,
          config.spedyApiKey,
        );
        await this.applyRemoteStatus(invoice.id, remote, invoice.client, config);
      } catch (err) {
        this.logger.warn(`Falha ao consultar nota ${invoice.id}`);
      }
    }
  }

  private async issueClient(
    companyId: string,
    clientId: string,
    period: IssuePeriod,
    source: ServiceInvoiceSourceEnum,
  ) {
    const config = await this.prisma.companyFiscalConfig.findUnique({
      where: { companyId },
    });
    const fiscal = getCompanyFiscalStatus(config);
    if (!fiscal.readyForEmission || !config?.spedyApiKey) {
      throw new BadRequestException(
        'Cadastro fiscal incompleto, emissor não habilitado ou certificado pendente',
      );
    }

    const client = await this.prisma.companyClient.findFirst({
      where: { id: clientId, companyId, deleted: false },
    });
    if (!client) throw new BadRequestException('Cliente não encontrado');

    const missing = getClientFiscalMissingFields(client).filter(
      (field) => field !== 'e-mail',
    );
    if (missing.length) {
      throw new BadRequestException(
        `Cadastro do cliente incompleto: ${missing.join(', ')}`,
      );
    }

    const finances = await this.loadFinances(companyId, period, clientId);
    const eligible = finances.filter((item) => !item.serviceInvoiceId);
    if (!eligible.length) {
      throw new BadRequestException('Não há lançamentos para emitir neste período');
    }

    const amount = eligible.reduce((sum, item) => sum + item.value, 0);
    const created = await this.prisma.companyServiceInvoice.create({
      data: {
        integrationId: `pending-${clientId}-${period.periodStart.getTime()}`,
        amount,
        source,
        status: ServiceInvoiceStatusEnum.PENDING,
        periodStart: period.periodStart,
        periodEnd: period.periodEnd,
        missingEmail: !client.email,
        company: { connect: { id: companyId } },
        client: { connect: { id: clientId } },
      },
    });

    await this.prisma.companyServiceInvoice.update({
      where: { id: created.id },
      data: { integrationId: created.id },
    });

    try {
      const remote = await this.spedy.createServiceInvoice(
        this.buildPayload(created.id, amount, eligible, client, config),
        config.spedyApiKey,
      );
      await this.prisma.companyFinance.updateMany({
        where: { id: { in: eligible.map((item) => item.id) } },
        data: { serviceInvoiceId: created.id },
      });
      return this.applyRemoteStatus(created.id, remote, client, config);
    } catch (err) {
      const message =
        err instanceof BadRequestException
          ? err.message
          : 'Falha ao emitir a nota';
      await this.prisma.companyServiceInvoice.update({
        where: { id: created.id },
        data: { status: ServiceInvoiceStatusEnum.ERROR, errorMessage: message },
      });
      throw err;
    }
  }

  private async applyRemoteStatus(
    invoiceId: string,
    remote: SpedyServiceInvoiceResponse,
    client: CompanyClient,
    config: CompanyFiscalConfig,
  ) {
    const status = mapRemoteStatus(remote.status);
    const updated = await this.prisma.companyServiceInvoice.update({
      where: { id: invoiceId },
      data: {
        providerId: remote.id,
        status,
        number: remote.number != null ? String(remote.number) : undefined,
        issuedAt: remote.issuedOn ? new Date(remote.issuedOn) : undefined,
        errorMessage:
          status === ServiceInvoiceStatusEnum.REJECTED ||
          status === ServiceInvoiceStatusEnum.ERROR
            ? remote.processingDetail?.message ?? 'Nota não autorizada'
            : null,
      },
    });

    if (
      status === ServiceInvoiceStatusEnum.AUTHORIZED &&
      !updated.emailSentAt &&
      client.email
    ) {
      const companyName = config.tradeName || config.legalName || 'Empresa';
      const result = await this.mail.sendInvoiceNotice({
        to: client.email,
        clientName: client.name,
        companyName,
        periodLabel: format(updated.periodStart, 'MMMM/yyyy', { locale: ptBR }),
        amount: formatMoney(updated.amount),
        number: updated.number,
      });
      if (!result?.error) {
        return this.prisma.companyServiceInvoice.update({
          where: { id: invoiceId },
          data: { emailSentAt: new Date() },
        });
      }
    }

    return updated;
  }

  private buildPayload(
    integrationId: string,
    amountCents: number,
    finances: CompanyFinance[],
    client: CompanyClient,
    config: CompanyFiscalConfig,
  ) {
    const address = client.fiscalAddress;
    const invoiceAmount = amountCents / 100;
    const issRate = config.issRate ?? 0;
    const description = finances
      .map((item) => item.title)
      .filter(Boolean)
      .join('; ')
      .slice(0, 1000);

    return {
      effectiveDate: new Date().toISOString(),
      status: 'enqueued' as const,
      sendEmailToCustomer: false,
      integrationId,
      description: description || 'Prestação de serviços',
      federalServiceCode: config.federalServiceCode ?? undefined,
      cityServiceCode: config.cityServiceCode ?? undefined,
      nbsCode: config.nbsCode ?? undefined,
      taxationType: config.taxationType ?? 'taxationInMunicipality',
      receiver: {
        name: client.name,
        federalTaxNumber: (client.cnpj || client.cpf || '').replace(/\D/g, ''),
        ...(client.email ? { email: client.email } : {}),
        address: {
          street: address?.street ?? '',
          number: address?.number ?? 'S/N',
          district: address?.neighborhood ?? '',
          postalCode: (address?.postalCode ?? '').replace(/\D/g, ''),
          ...(address?.complement
            ? { additionalInformation: address.complement }
            : {}),
          city: {
            ...(address?.cityCode ? { code: address.cityCode } : {}),
            name: address?.city ?? '',
            state: address?.state ?? '',
          },
        },
      },
      total: {
        invoiceAmount,
        issRate,
        issAmount: Number((invoiceAmount * issRate).toFixed(2)),
        issWithheld: !!config.issWithheld,
      },
    };
  }

  private loadFinances(
    companyId: string,
    period: IssuePeriod,
    clientId?: string,
  ) {
    const where: Prisma.CompanyFinanceWhereInput = {
      companyId,
      deleted: false,
      flow: FinanceFlowEnum.IN,
      clientId: clientId ?? { not: null },
      isInstallment: false,
      paidFromAdvance: false,
      isAdvanceDeposit: false,
      date: { gte: period.periodStart, lte: period.periodEnd },
      ...(period.financeStatus ? { status: period.financeStatus } : {}),
    };

    return this.prisma.companyFinance.findMany({
      where,
      include: { client: true },
      orderBy: { date: 'asc' },
    });
  }
}

function mapRemoteStatus(status?: string): ServiceInvoiceStatusEnum {
  const value = (status ?? '').toLowerCase();
  if (value === 'authorized' || value === 'issued') {
    return ServiceInvoiceStatusEnum.AUTHORIZED;
  }
  if (value === 'rejected' || value === 'denied' || value === 'cancelled') {
    return ServiceInvoiceStatusEnum.REJECTED;
  }
  if (value === 'error' || value === 'failed') {
    return ServiceInvoiceStatusEnum.ERROR;
  }
  return ServiceInvoiceStatusEnum.PROCESSING;
}

function formatMoney(cents: number) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}
