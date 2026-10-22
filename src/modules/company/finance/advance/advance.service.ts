import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AdvanceStatusEnum,
  FinanceFlowEnum,
  FinanceStatusEnum,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { WalletService } from '../wallet/wallet.service';
import { CreateAdvanceDto } from './dto/create-advance.dto';

const applicationSelect = {
  id: true,
  protocol: true,
  title: true,
  value: true,
  tax: true,
  retention: true,
  flow: true,
  status: true,
  paymentDate: true,
  date: true,
} satisfies Prisma.CompanyFinanceSelect;

@Injectable()
export class AdvanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
    private readonly walletService: WalletService,
  ) {}

  async findAll(companyId: string) {
    return this.prisma.companyFinanceAdvance.findMany({
      where: { companyId },
      include: {
        applications: {
          where: {
            deleted: false,
            isAdvanceDeposit: false,
          },
          select: applicationSelect,
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(advanceId: string, companyId: string) {
    const advance = await this.prisma.companyFinanceAdvance.findFirst({
      where: { id: advanceId, companyId },
      include: {
        applications: {
          where: {
            deleted: false,
            isAdvanceDeposit: false,
          },
          select: applicationSelect,
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!advance) {
      throw new NotFoundException('Adiantamento não encontrado');
    }

    return advance;
  }

  async create(dto: CreateAdvanceDto, userId: string, companyId: string) {
    const finances = await this.prisma.companyFinance.findMany({
      where: {
        id: { in: dto.financeIds },
        companyId,
        deleted: false,
      },
    });

    if (finances.length !== dto.financeIds.length) {
      throw new BadRequestException(
        'Um ou mais lançamentos selecionados não foram encontrados',
      );
    }

    for (const finance of finances) {
      if (finance.flow !== FinanceFlowEnum.IN) {
        throw new BadRequestException(
          'Somente lançamentos de entrada podem compor um adiantamento',
        );
      }
      if (finance.status === FinanceStatusEnum.PAID) {
        throw new BadRequestException(
          'Lançamentos já pagos não podem compor um adiantamento',
        );
      }
      if (finance.status === FinanceStatusEnum.CANCELLED) {
        throw new BadRequestException(
          'Lançamentos cancelados não podem compor um adiantamento',
        );
      }
      if (finance.advanceId) {
        throw new BadRequestException(
          'Um ou mais lançamentos já estão vinculados a outro adiantamento',
        );
      }
    }

    const totalValue = finances.reduce((sum, f) => sum + f.value, 0);
    if (totalValue <= 0) {
      throw new BadRequestException(
        'A soma dos lançamentos selecionados deve ser positiva',
      );
    }

    if (dto.receivedValue <= 0 || dto.receivedValue > totalValue) {
      throw new BadRequestException(
        'O valor recebido deve ser positivo e não maior que a soma dos lançamentos',
      );
    }

    const interestValue = totalValue - dto.receivedValue;
    const advanceDate = new Date(dto.date);

    const protocol = await this.util.generateUniqueProtocol(
      'companyFinanceAdvance',
    );

    const advance = await this.prisma.$transaction(async (tx) => {
      const created = await tx.companyFinanceAdvance.create({
        data: {
          protocol,
          title: dto.title,
          description: dto.description,
          observation: dto.observation,
          totalValue,
          receivedValue: dto.receivedValue,
          remainingValue: totalValue,
          date: advanceDate,
          status: AdvanceStatusEnum.OPEN,
          company: { connect: { id: companyId } },
          createdBy: { connect: { id: userId } },
          bank: { connect: { id: dto.bankId } },
          method: { connect: { id: dto.methodId } },
          ...(dto.typeId && { type: { connect: { id: dto.typeId } } }),
        },
      });

      await tx.companyFinance.updateMany({
        where: { id: { in: dto.financeIds } },
        data: {
          advanceId: created.id,
          paidFromAdvance: true,
        },
      });

      await this.createAdvanceFinance(tx, {
        title: `Adiantamento: ${dto.title}`,
        description: dto.description,
        observation: dto.observation,
        value: dto.receivedValue,
        date: advanceDate,
        flow: FinanceFlowEnum.IN,
        isAdvanceDeposit: true,
        advanceId: created.id,
        companyId,
        userId,
        bankId: dto.bankId,
        methodId: dto.methodId,
        typeId: dto.typeId,
      });

      if (interestValue > 0) {
        await this.createAdvanceFinance(tx, {
          title: `Juros adiantamento: ${dto.title}`,
          description: `Diferença entre valor nominal (${totalValue}) e valor recebido (${dto.receivedValue})`,
          value: interestValue,
          date: advanceDate,
          flow: FinanceFlowEnum.OUT,
          isAdvanceDeposit: false,
          advanceId: created.id,
          companyId,
          userId,
          bankId: dto.bankId,
          methodId: dto.methodId,
          typeId: dto.typeId,
        });
      }

      return created;
    });

    await this.walletService.recalculate(companyId);

    return this.findOne(advance.id, companyId);
  }

  async recordLinkedFinancePaid(
    advanceId: string,
    companyId: string,
    appliedAmount: number,
  ) {
    const advance = await this.prisma.companyFinanceAdvance.findFirst({
      where: { id: advanceId, companyId },
    });

    if (!advance) {
      throw new NotFoundException('Adiantamento não encontrado');
    }

    if (appliedAmount <= 0) {
      throw new BadRequestException('Valor aplicado inválido');
    }

    if (appliedAmount > advance.remainingValue) {
      throw new BadRequestException(
        'Valor do lançamento excede o saldo nominal restante do adiantamento',
      );
    }

    const remainingValue = advance.remainingValue - appliedAmount;

    await this.prisma.companyFinanceAdvance.update({
      where: { id: advanceId },
      data: {
        remainingValue,
        status: this.resolveStatus(remainingValue, advance.totalValue),
      },
    });
  }

  async revertLinkedFinancePaid(
    advanceId: string,
    companyId: string,
    appliedAmount: number,
  ) {
    const advance = await this.prisma.companyFinanceAdvance.findFirst({
      where: { id: advanceId, companyId },
    });

    if (!advance) {
      throw new NotFoundException('Adiantamento não encontrado');
    }

    const remainingValue = Math.min(
      advance.totalValue,
      advance.remainingValue + appliedAmount,
    );

    await this.prisma.companyFinanceAdvance.update({
      where: { id: advanceId },
      data: {
        remainingValue,
        status: this.resolveStatus(remainingValue, advance.totalValue),
      },
    });
  }

  async remove(advanceId: string, companyId: string) {
    const advance = await this.findOne(advanceId, companyId);

    const linkedPaid = advance.applications.some(
      (app) => app.status === FinanceStatusEnum.PAID,
    );
    if (linkedPaid) {
      throw new BadRequestException(
        'Adiantamentos com lançamentos quitados não podem ser excluídos',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.companyFinance.updateMany({
        where: {
          advanceId,
          isAdvanceDeposit: false,
        },
        data: {
          advanceId: null,
          paidFromAdvance: false,
        },
      });

      await tx.companyFinance.updateMany({
        where: { advanceId },
        data: { deleted: true },
      });

      await tx.companyFinanceAdvance.delete({
        where: { id: advanceId },
      });
    });

    await this.walletService.recalculate(companyId);

    return { ok: true };
  }

  private async createAdvanceFinance(
    tx: Prisma.TransactionClient,
    params: {
      title: string;
      description?: string;
      observation?: string;
      value: number;
      date: Date;
      flow: FinanceFlowEnum;
      isAdvanceDeposit: boolean;
      advanceId: string;
      companyId: string;
      userId: string;
      bankId: string;
      methodId: string;
      typeId?: string;
    },
  ) {
    const protocol = await this.util.generateUniqueProtocol('companyFinance');

    await tx.companyFinance.create({
      data: {
        protocol,
        title: params.title,
        description: params.description,
        observation: params.observation,
        value: params.value,
        date: params.date,
        paymentDate: params.date,
        flow: params.flow,
        status: FinanceStatusEnum.PAID,
        approved: true,
        isAdvanceDeposit: params.isAdvanceDeposit,
        paidFromAdvance: false,
        advance: { connect: { id: params.advanceId } },
        company: { connect: { id: params.companyId } },
        createdBy: { connect: { id: params.userId } },
        responsible: { connect: { id: params.userId } },
        bank: { connect: { id: params.bankId } },
        method: { connect: { id: params.methodId } },
        ...(params.typeId && { type: { connect: { id: params.typeId } } }),
      },
    });
  }

  private resolveStatus(
    remainingValue: number,
    totalValue: number,
  ): AdvanceStatusEnum {
    if (remainingValue <= 0) return AdvanceStatusEnum.SETTLED;
    if (remainingValue < totalValue) return AdvanceStatusEnum.PARTIAL;
    return AdvanceStatusEnum.OPEN;
  }
}
