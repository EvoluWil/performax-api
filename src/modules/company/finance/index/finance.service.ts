import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FinanceFlowEnum, FinanceStatusEnum } from '@prisma/client';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { WalletService } from '../wallet/wallet.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';

@Injectable()
export class FinanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
    private readonly util: UtilService,
    private readonly walletService: WalletService,
  ) {}

  async create(
    { isRecurring, recurringEndDate, recurrence, ...rest }: CreateFinanceDto,
    userId: string,
    companyId: string,
  ) {
    const type = await this.prisma.companyFinanceType.findUnique({
      where: { id: rest.typeId },
    });

    const data = normalizeRelations(rest) as any;
    const protocol = await this.util.generateUniqueProtocol('companyFinance');

    const finance = await this.prisma.companyFinance.create({
      data: {
        ...data,
        protocol,
        status: FinanceStatusEnum.PENDING,
        approved: type?.needApprove ? false : true,
        createdBy: { connect: { id: userId } },
        responsible: {
          connect: { id: data.responsible?.connect?.id ?? userId },
        },
        company: { connect: { id: companyId } },
      },
    });

    if (isRecurring || recurrence) {
      const recurring = await this.prisma.companyFinanceRecurring.create({
        data: {
          title: data.title,
          description: data.description,
          value: data.value,
          date: data.date,
          observation: data.observation,
          flow: data.flow,
          type: data.type,
          method: data.method,
          bank: data.bank,
          category: data.category,
          ...(data.client ? { client: data.client } : {}),
          ...(data.payee ? { payee: data.payee } : {}),
          ...(data.employee ? { employee: data.employee } : {}),
          recurrence: recurrence || null,
          endDate: recurringEndDate || null,
          lastDate: data.date,
          company: { connect: { id: companyId } },
        },
      });

      await this.prisma.companyFinance.update({
        where: { id: finance.id },
        data: { recurrenceMasterId: recurring.id },
      });
    }

    return finance;
  }

  async findAll(companyId: string) {
    const where = { companyId, deleted: false };
    const { count, query } = await this.qb.query('companyFinance', where);
    const financials = await this.prisma.companyFinance.findMany({
      ...query,
    });
    return {
      data: financials,
      count,
    };
  }

  // async findData() {
  //   const select = {
  //     id: true,
  //     name: true,
  //   };

  //   const orderBy: unknown = { name: 'asc' };

  //   const clients = await this.prisma.client.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const types = await this.prisma.financeType.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const methods = await this.prisma.paymentMethod.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const banks = await this.prisma.bank.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const users = await this.prisma.user.findMany({
  //     select,
  //     orderBy,
  //     where: { active: true },
  //   });

  //   const companies = await this.prisma.company.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const categories = await this.prisma.financeCategory.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const favored = await this.prisma.financeFavored.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const employees = await this.prisma.employee.findMany({
  //     select,
  //     orderBy,
  //   });

  //   return {
  //     clients,
  //     types,
  //     users,
  //     banks,
  //     methods,
  //     companies,
  //     categories,
  //     favored,
  //     employees,
  //   };
  // }

  async findOne(financeId: string, companyId: string) {
    const finance = await this.prisma.companyFinance.findFirst({
      where: { id: financeId, companyId, deleted: false },
      include: {
        client: true,
        type: true,
        createdBy: { select: { name: true, id: true } },
        method: true,
        bank: true,
        category: true,
        company: true,
        payee: true,
        employee: true,
        companyIn: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!finance) {
      throw new BadRequestException('Lançamento não encontrado!');
    }

    const result: any = { ...finance };
    if (finance.recurrenceMasterId) {
      result.recurringMaster =
        await this.prisma.companyFinanceRecurring.findUnique({
          where: { id: finance.recurrenceMasterId },
          select: { id: true, recurrence: true },
        });
    }

    return result;
  }

  async update(
    financeId: string,
    companyId: string,
    updateFinanceDto: UpdateFinanceDto,
  ) {
    const finance = await this.prisma.companyFinance.findFirst({
      where: { id: financeId, companyId },
    });

    if (!finance) {
      throw new BadRequestException('Despesa não encontrada!');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { recurrence: _recurrence, ...rest } = updateFinanceDto as any;
    const data = normalizeRelations(rest);

    const wasNotPaid = finance.status !== FinanceStatusEnum.PAID;
    const willBePaid = (data as any).status === FinanceStatusEnum.PAID;
    const wasPaid = finance.status === FinanceStatusEnum.PAID;
    const willNotBePaid =
      (data as any).status !== undefined &&
      (data as any).status !== FinanceStatusEnum.PAID;

    await this.prisma.companyFinance.update({
      where: { id: financeId },
      data,
    });

    // Transfer PAID cascade: mark the linked entry as PAID too
    if (wasNotPaid && willBePaid && finance.linkedFinanceId) {
      const linked = await this.prisma.companyFinance.findUnique({
        where: { id: finance.linkedFinanceId },
        select: { companyId: true },
      });

      if (linked) {
        await this.prisma.companyFinance.update({
          where: { id: finance.linkedFinanceId },
          data: { status: FinanceStatusEnum.PAID },
        });
        await this.walletService.recalculate(linked.companyId);
      }
    }

    if ((wasNotPaid && willBePaid) || (wasPaid && willNotBePaid)) {
      await this.walletService.recalculate(companyId);
    }

    return { ok: true };
  }

  async remove(financeId: string, companyId: string) {
    const finance = await this.prisma.companyFinance.findFirst({
      where: { id: financeId, companyId },
    });

    if (!finance) {
      throw new BadRequestException('Despesa não encontrada!');
    }

    return this.prisma.companyFinance.update({
      where: { id: financeId },
      data: { deleted: true },
    });
  }

  async revertPayment(financeId: string, companyId: string) {
    const finance = await this.prisma.companyFinance.findFirst({
      where: { id: financeId, companyId, deleted: false },
      select: {
        id: true,
        companyId: true,
        status: true,
        linkedFinanceId: true,
      },
    });

    if (!finance) {
      throw new BadRequestException('Lançamento não encontrado!');
    }

    if (finance.status !== FinanceStatusEnum.PAID) {
      throw new BadRequestException(
        'Apenas lançamentos pagos podem ter pagamento revertido!',
      );
    }

    let linkedCompanyId: string | null = null;

    await this.prisma.companyFinance.update({
      where: { id: finance.id },
      data: {
        status: FinanceStatusEnum.PENDING,
        paymentDate: null,
        tax: 0,
        retention: 0,
      },
    });

    if (finance.linkedFinanceId) {
      const linked = await this.prisma.companyFinance.findUnique({
        where: { id: finance.linkedFinanceId },
        select: { id: true, companyId: true, status: true },
      });

      if (linked && linked.status === FinanceStatusEnum.PAID) {
        linkedCompanyId = linked.companyId;
        await this.prisma.companyFinance.update({
          where: { id: linked.id },
          data: {
            status: FinanceStatusEnum.PENDING,
            paymentDate: null,
            tax: 0,
            retention: 0,
          },
        });
      }
    }

    await this.walletService.recalculate(companyId);
    if (linkedCompanyId && linkedCompanyId !== companyId) {
      await this.walletService.recalculate(linkedCompanyId);
    }

    return { ok: true };
  }

  async approve(financeId: string, companyId: string, approved: boolean) {
    const finance = await this.prisma.companyFinance.findFirst({
      where: { id: financeId, companyId },
    });

    if (!finance) {
      throw new BadRequestException('Lançamento não encontrado!');
    }

    return this.prisma.companyFinance.update({
      where: { id: financeId },
      data: approved
        ? { approved: true }
        : { approved: true, status: FinanceStatusEnum.REJECTED },
    });
  }

  async transfer(dto: CreateTransferDto, companyId: string, userId: string) {
    // Security: verify both companies are in the same CompanyGroup
    const [sourceCompany, destCompany] = await Promise.all([
      this.prisma.company.findUnique({
        where: { id: companyId },
        select: { groupId: true },
      }),
      this.prisma.company.findUnique({
        where: { id: dto.companyInId },
        select: { groupId: true },
      }),
    ]);

    if (
      !sourceCompany?.groupId ||
      !destCompany?.groupId ||
      sourceCompany.groupId !== destCompany.groupId
    ) {
      throw new ForbiddenException(
        'Transferência não permitida: as empresas não pertencem ao mesmo grupo',
      );
    }

    const [protocolOut, protocolIn] = await Promise.all([
      this.util.generateUniqueProtocol('companyFinance'),
      this.util.generateUniqueProtocol('companyFinance'),
    ]);

    const commonData = {
      title: dto.title,
      description: dto.description,
      value: dto.value,
      tax: dto.tax ?? 0,
      retention: dto.retention ?? 0,
      date: dto.date,
      status: FinanceStatusEnum.PENDING,
      approved: true,
      ...(dto.bankId && { bank: { connect: { id: dto.bankId } } }),
      ...(dto.methodId && { method: { connect: { id: dto.methodId } } }),
      ...(dto.categoryId && { category: { connect: { id: dto.categoryId } } }),
      createdBy: { connect: { id: userId } },
    };

    // Create both entries in a transaction
    const [outEntry, inEntry] = await this.prisma.$transaction([
      this.prisma.companyFinance.create({
        data: {
          ...(commonData as any),
          protocol: protocolOut,
          flow: FinanceFlowEnum.OUT,
          company: { connect: { id: companyId } },
          companyIn: { connect: { id: dto.companyInId } },
        },
      }),
      this.prisma.companyFinance.create({
        data: {
          ...(commonData as any),
          protocol: protocolIn,
          flow: FinanceFlowEnum.IN,
          company: { connect: { id: dto.companyInId } },
          companyIn: { connect: { id: companyId } },
        },
      }),
    ]);

    // Link both entries to each other
    await this.prisma.$transaction([
      this.prisma.companyFinance.update({
        where: { id: outEntry.id },
        data: { linkedFinanceId: inEntry.id },
      }),
      this.prisma.companyFinance.update({
        where: { id: inEntry.id },
        data: { linkedFinanceId: outEntry.id },
      }),
    ]);

    return outEntry;
  }
}
