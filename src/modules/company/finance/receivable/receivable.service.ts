import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FinanceStatusEnum, ReceivableStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { CreateReceivableDto } from './dto/create-receivable.dto';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class ReceivableService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}

  async findAll(companyId: string) {
    return this.prisma.companyFinanceReceivable.findMany({
      where: { companyId },
      include: {
        installments: {
          where: { deleted: false },
          select: {
            id: true,
            receivableInstallment: true,
            status: true,
            value: true,
            date: true,
            paymentDate: true,
          },
          orderBy: { receivableInstallment: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(receivableId: string, companyId: string) {
    const receivable = await this.prisma.companyFinanceReceivable.findFirst({
      where: { id: receivableId, companyId },
      include: {
        installments: {
          where: { deleted: false },
          orderBy: { receivableInstallment: 'asc' },
        },
      },
    });

    if (!receivable) {
      throw new NotFoundException('Duplicata não encontrada');
    }

    return receivable;
  }

  async create(
    dto: CreateReceivableDto,
    userId: string,
    companyId: string,
  ) {
    const protocol = await this.util.generateUniqueProtocol(
      'companyFinanceReceivable',
    );

    const installmentValue = Math.floor(dto.totalValue / dto.installmentCount);
    // Distribute the remainder to the last installment
    const remainder = dto.totalValue - installmentValue * dto.installmentCount;

    const firstDue = new Date(dto.firstDueDate);

    // Create the receivable master
    const receivable = await this.prisma.companyFinanceReceivable.create({
      data: {
        protocol,
        title: dto.title,
        description: dto.description,
        observation: dto.observation,
        totalValue: dto.totalValue,
        installmentCount: dto.installmentCount,
        flow: dto.flow,
        status: ReceivableStatusEnum.OPEN,
        company: { connect: { id: companyId } },
        createdBy: { connect: { id: userId } },
      },
    });

    // Create installment CompanyFinance entries
    for (let i = 0; i < dto.installmentCount; i++) {
      const dueDate = new Date(firstDue.getTime() + i * 30 * DAY_MS);
      const isLast = i === dto.installmentCount - 1;
      const value = isLast ? installmentValue + remainder : installmentValue;

      await this.util.createWithUniqueProtocol('companyFinance', {
        title: `${dto.title} (${i + 1}/${dto.installmentCount})`,
        description: dto.description,
        observation: dto.observation,
        value,
        date: dueDate,
        flow: dto.flow,
        status: FinanceStatusEnum.PENDING,
        approved: true,
        isInstallment: true,
        receivableInstallment: i + 1,
        receivable: { connect: { id: receivable.id } },
        company: { connect: { id: companyId } },
        createdBy: { connect: { id: userId } },
        ...(dto.bankId && { bank: { connect: { id: dto.bankId } } }),
        ...(dto.methodId && { method: { connect: { id: dto.methodId } } }),
        ...(dto.typeId && { type: { connect: { id: dto.typeId } } }),
        ...(dto.categoryId && {
          category: { connect: { id: dto.categoryId } },
        }),
        ...(dto.segmentId && {
          segment: { connect: { id: dto.segmentId } },
        }),
        ...(dto.payeeId && { payee: { connect: { id: dto.payeeId } } }),
        ...(dto.clientId && { client: { connect: { id: dto.clientId } } }),
        ...(dto.employeeId && {
          employee: { connect: { id: dto.employeeId } },
        }),
        ...(dto.responsibleId
          ? { responsible: { connect: { id: dto.responsibleId } } }
          : { responsible: { connect: { id: userId } } }),
      });
    }

    return this.findOne(receivable.id, companyId);
  }

  /**
   * Called by FinanceService when an installment is marked as PAID or reverted.
   * Updates paidCount and status of the parent receivable.
   */
  async syncStatus(receivableId: string) {
    const installments = await this.prisma.companyFinance.findMany({
      where: { receivableId, deleted: false },
      select: { status: true },
    });

    const paidCount = installments.filter(
      (i) => i.status === FinanceStatusEnum.PAID,
    ).length;

    const total = installments.length;

    let status: ReceivableStatusEnum;
    if (paidCount === 0) status = ReceivableStatusEnum.OPEN;
    else if (paidCount >= total) status = ReceivableStatusEnum.SETTLED;
    else status = ReceivableStatusEnum.PARTIAL;

    await this.prisma.companyFinanceReceivable.update({
      where: { id: receivableId },
      data: { paidCount, status },
    });
  }

  async remove(receivableId: string, companyId: string) {
    await this.findOne(receivableId, companyId);

    // Soft-delete all pending/approved installments
    await this.prisma.companyFinance.updateMany({
      where: {
        receivableId,
        status: { in: [FinanceStatusEnum.PENDING, FinanceStatusEnum.APPROVED] },
      },
      data: { deleted: true },
    });

    return this.prisma.companyFinanceReceivable.delete({
      where: { id: receivableId },
    });
  }

  async validateFinanceNotInstallment(financeId: string) {
    const finance = await this.prisma.companyFinance.findUnique({
      where: { id: financeId },
      select: { isInstallment: true },
    });

    if (finance?.isInstallment) {
      throw new BadRequestException(
        'Lançamentos de duplicata não podem ser editados diretamente. Edite a duplicata.',
      );
    }
  }
}
