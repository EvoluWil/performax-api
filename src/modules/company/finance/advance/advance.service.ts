import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AdvanceStatusEnum,
  FinanceFlowEnum,
  FinanceStatusEnum,
} from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { WalletService } from '../wallet/wallet.service';
import { CreateAdvanceDto } from './dto/create-advance.dto';

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
            paidFromAdvance: true,
          },
          select: {
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
          },
          orderBy: { paymentDate: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAvailable(companyId: string) {
    return this.prisma.companyFinanceAdvance.findMany({
      where: {
        companyId,
        remainingValue: { gt: 0 },
        status: { not: AdvanceStatusEnum.SETTLED },
      },
      select: {
        id: true,
        protocol: true,
        title: true,
        totalValue: true,
        remainingValue: true,
        status: true,
        date: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(advanceId: string, companyId: string) {
    const advance = await this.prisma.companyFinanceAdvance.findFirst({
      where: { id: advanceId, companyId },
      include: {
        applications: {
          where: {
            deleted: false,
            paidFromAdvance: true,
          },
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!advance) {
      throw new NotFoundException('Adiantamento não encontrado');
    }

    return advance;
  }

  async create(dto: CreateAdvanceDto, userId: string, companyId: string) {
    if (dto.totalValue <= 0) {
      throw new BadRequestException('O valor do adiantamento deve ser positivo');
    }

    const protocol = await this.util.generateUniqueProtocol(
      'companyFinanceAdvance',
    );

    const advance = await this.prisma.companyFinanceAdvance.create({
      data: {
        protocol,
        title: dto.title,
        description: dto.description,
        observation: dto.observation,
        totalValue: dto.totalValue,
        remainingValue: dto.totalValue,
        date: new Date(dto.date),
        status: AdvanceStatusEnum.OPEN,
        company: { connect: { id: companyId } },
        createdBy: { connect: { id: userId } },
        ...(dto.bankId && { bank: { connect: { id: dto.bankId } } }),
        ...(dto.methodId && { method: { connect: { id: dto.methodId } } }),
        ...(dto.typeId && { type: { connect: { id: dto.typeId } } }),
      },
    });

    await this.util.createWithUniqueProtocol('companyFinance', {
      title: `Adiantamento: ${dto.title}`,
      description: dto.description,
      observation: dto.observation,
      value: dto.totalValue,
      date: new Date(dto.date),
      paymentDate: new Date(dto.date),
      flow: FinanceFlowEnum.IN,
      status: FinanceStatusEnum.PAID,
      approved: true,
      isAdvanceDeposit: true,
      advance: { connect: { id: advance.id } },
      company: { connect: { id: companyId } },
      createdBy: { connect: { id: userId } },
      responsible: { connect: { id: userId } },
      ...(dto.bankId && { bank: { connect: { id: dto.bankId } } }),
      ...(dto.methodId && { method: { connect: { id: dto.methodId } } }),
      ...(dto.typeId && { type: { connect: { id: dto.typeId } } }),
    });

    await this.walletService.recalculate(companyId);

    return this.findOne(advance.id, companyId);
  }

  /**
   * Called when a finance is marked PAID using an advance.
   */
  async apply(
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
        'Saldo do adiantamento insuficiente para este pagamento',
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

  /**
   * Called when a finance paid from advance is reverted.
   */
  async revertApplication(
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

    const hasApplications = advance.applications.length > 0;
    if (hasApplications) {
      throw new BadRequestException(
        'Adiantamentos com lançamentos aplicados não podem ser excluídos',
      );
    }

    await this.prisma.companyFinance.updateMany({
      where: {
        advanceId,
        isAdvanceDeposit: true,
      },
      data: { deleted: true },
    });

    await this.prisma.companyFinanceAdvance.delete({
      where: { id: advanceId },
    });

    await this.walletService.recalculate(companyId);

    return { ok: true };
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
