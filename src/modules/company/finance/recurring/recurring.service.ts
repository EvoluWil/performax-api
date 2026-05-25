import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FinanceStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { UpdateRecurringDto } from './dto/update-recurring.dto';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class RecurringService {
  private readonly logger = new Logger(RecurringService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}
  async findAll(companyId: string) {
    const recurring = await this.prisma.companyFinanceRecurring.findMany({
      where: {
        companyId: companyId,
      },
    });

    return recurring;
  }

  async findOne(recurringId: string, companyId: string) {
    const recurring = await this.prisma.companyFinanceRecurring.findFirst({
      where: {
        id: recurringId,
        companyId: companyId,
      },
    });

    if (!recurring) {
      throw new NotFoundException('Recorrência não encontrada');
    }

    return recurring;
  }

  async update(
    recurringId: string,
    companyId: string,
    updateRecurringDto: UpdateRecurringDto,
  ) {
    await this.findOne(recurringId, companyId);

    const data = normalizeRelations(updateRecurringDto);

    return this.prisma.companyFinanceRecurring.update({
      where: { id: recurringId },
      data,
    });
  }

  async remove(recurringId: string, companyId: string) {
    await this.findOne(recurringId, companyId);

    return this.prisma.companyFinanceRecurring.delete({
      where: { id: recurringId },
    });
  }

  /**
   * Endpoint legado: processa apenas vencidos (de `lastDate` até `now`).
   * Delegado ao `generateForNextDays` com janela 0 para evitar duplicação
   * de lógica e garantir o mesmo comportamento (createdBy fallback,
   * idempotência, etc.).
   */
  async processRecurrences(companyId: string) {
    return this.generateForNextDays(companyId, 0);
  }

  /**
   * Lazy generation: cria todos os lançamentos financeiros que deveriam
   * existir na janela [now, now + days] a partir das recorrências
   * configuradas. Usa `lastDate` como high-water mark e respeita `endDate`.
   * Idempotente via verificação de existência por `(recurrenceMasterId, date)`.
   */
  async generateForNextDays(companyId: string, days = 30) {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + days * DAY_MS);

    const recurrings = await this.prisma.companyFinanceRecurring.findMany({
      where: {
        companyId,
        recurrence: { not: null },
        lastDate: { lt: windowEnd },
      },
    });

    if (recurrings.length === 0) {
      return { processed: 0, created: 0, protocols: [] };
    }

    // CompanyFinanceRecurring não guarda createdById; recuperamos do primeiro
    // CompanyFinance vinculado ao master (o lançamento original sempre é
    // criado com createdById em finance.service.create).
    const masterIds = recurrings.map((r) => r.id);
    const linkedFinancials = await this.prisma.companyFinance.findMany({
      where: { recurrenceMasterId: { in: masterIds } },
      select: {
        recurrenceMasterId: true,
        createdById: true,
        responsibleId: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    const createdByByMaster = new Map<string, string>();
    const responsibleByMaster = new Map<string, string | null>();
    for (const f of linkedFinancials) {
      if (!f.recurrenceMasterId) continue;
      if (!createdByByMaster.has(f.recurrenceMasterId)) {
        createdByByMaster.set(f.recurrenceMasterId, f.createdById);
        responsibleByMaster.set(
          f.recurrenceMasterId,
          f.responsibleId ?? null,
        );
      }
    }

    const createdProtocols: string[] = [];
    const { RRule } = await import('rrule');

    for (const recurring of recurrings) {
      try {
        if (!recurring.recurrence) continue;

        const createdById = createdByByMaster.get(recurring.id);
        if (!createdById) {
          this.logger.warn(
            `Finance recurring ${recurring.id} has no linked CompanyFinance with createdById; skipping lazy generation`,
          );
          continue;
        }
        const responsibleId = responsibleByMaster.get(recurring.id) ?? null;

        const endDate = recurring.endDate ?? new Date('2100-01-01');
        const effectiveEnd =
          endDate.getTime() < windowEnd.getTime() ? endDate : windowEnd;

        if (recurring.lastDate.getTime() >= effectiveEnd.getTime()) continue;

        let rule;
        try {
          rule = RRule.fromString(recurring.recurrence);
        } catch (e) {
          this.logger.warn(
            `Invalid RRULE on finance recurring ${recurring.id}, skipping`,
          );
          continue;
        }

        const occurrences = (
          rule.between(recurring.lastDate, effectiveEnd, true) as Date[]
        ).filter((d) => d.getTime() > recurring.lastDate.getTime());

        if (occurrences.length === 0) {
          await this.prisma.companyFinanceRecurring.update({
            where: { id: recurring.id },
            data: { lastDate: effectiveEnd },
          });
          continue;
        }

        const existingItems = await this.prisma.companyFinance.findMany({
          where: {
            recurrenceMasterId: recurring.id,
            date: { in: occurrences },
          },
          select: { date: true },
        });
        const existingTimes = new Set(
          existingItems.map((e) => e.date.getTime()),
        );
        const toCreate = occurrences.filter(
          (o) => !existingTimes.has(o.getTime()),
        );

        for (const dueDate of toCreate) {
          const created = (await this.util.createWithUniqueProtocol(
            'companyFinance',
            {
              title: recurring.title,
              description: recurring.description,
              value: recurring.value,
              date: dueDate,
              flow: recurring.flow,
              observation: recurring.observation,
              status: FinanceStatusEnum.PENDING,
              approved: true,
              recurrenceMasterId: recurring.id,
              createdBy: { connect: { id: createdById } },
              company: { connect: { id: companyId } },
              ...(responsibleId && {
                responsible: { connect: { id: responsibleId } },
              }),
              ...(recurring.typeId && {
                type: { connect: { id: recurring.typeId } },
              }),
              ...(recurring.bankId && {
                bank: { connect: { id: recurring.bankId } },
              }),
              ...(recurring.methodId && {
                method: { connect: { id: recurring.methodId } },
              }),
              ...(recurring.categoryId && {
                category: { connect: { id: recurring.categoryId } },
              }),
              ...(recurring.payeeId && {
                payee: { connect: { id: recurring.payeeId } },
              }),
              ...(recurring.clientId && {
                client: { connect: { id: recurring.clientId } },
              }),
              ...(recurring.employeeId && {
                employee: { connect: { id: recurring.employeeId } },
              }),
            },
          )) as { protocol: string };

          createdProtocols.push(created.protocol);
        }

        const lastOcc = occurrences[occurrences.length - 1];
        const newMarker =
          lastOcc.getTime() > effectiveEnd.getTime() ? lastOcc : effectiveEnd;
        await this.prisma.companyFinanceRecurring.update({
          where: { id: recurring.id },
          data: { lastDate: newMarker },
        });
      } catch (err) {
        this.logger.error(
          'Error generating finance recurrences for ' + recurring.id,
          err,
        );
      }
    }

    return {
      processed: recurrings.length,
      created: createdProtocols.length,
      protocols: createdProtocols,
    };
  }
}
