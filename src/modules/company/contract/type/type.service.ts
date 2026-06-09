import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FinanceStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ApplyAdjustmentDto } from './dto/apply-adjustment.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypeService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTypeDto: CreateTypeDto, companyId: string) {
    return this.prisma.companyContractType.create({
      data: {
        ...createTypeDto,
        company: { connect: { id: companyId } },
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.companyContractType.findMany({
      where: { companyId, deleted: false },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(typeId: string, companyId: string) {
    const type = await this.prisma.companyContractType.findFirst({
      where: { id: typeId, companyId, deleted: false },
    });

    if (!type) {
      throw new NotFoundException('Tipo de contrato não encontrado');
    }

    return type;
  }

  async update(
    typeId: string,
    companyId: string,
    updateTypeDto: UpdateTypeDto,
  ) {
    await this.findOne(typeId, companyId);

    return this.prisma.companyContractType.update({
      where: { id: typeId },
      data: updateTypeDto,
    });
  }

  async remove(typeId: string, companyId: string) {
    await this.findOne(typeId, companyId);

    return this.prisma.companyContractType.update({
      where: { id: typeId },
      data: { deleted: true },
    });
  }

  async applyAdjustment(
    typeId: string,
    companyId: string,
    { percentage }: ApplyAdjustmentDto,
  ) {
    const type = await this.findOne(typeId, companyId);
    const now = new Date();
    const adjustmentEntry = { percentage, appliedAt: now };

    const contracts = await this.prisma.companyContract.findMany({
      where: {
        typeId,
        companyId,
        deleted: false,
        active: true,
      },
      select: { id: true, value: true, recurringId: true },
    });

    const multiplier = 1 + percentage / 100;

    for (const contract of contracts) {
      const newValue = Math.round(contract.value * multiplier);

      await this.prisma.companyContract.update({
        where: { id: contract.id },
        data: { value: newValue },
      });

      if (contract.recurringId) {
        await this.prisma.companyFinanceRecurring.update({
          where: { id: contract.recurringId },
          data: { value: newValue },
        });

        await this.prisma.companyFinance.updateMany({
          where: {
            recurrenceMasterId: contract.recurringId,
            date: { gte: now },
            status: {
              in: [FinanceStatusEnum.PENDING, FinanceStatusEnum.APPROVED],
            },
            deleted: false,
          },
          data: { value: newValue },
        });
      }
    }

    return this.prisma.companyContractType.update({
      where: { id: typeId },
      data: {
        adjustments: [...(type.adjustments ?? []), adjustmentEntry],
        lastAdjustmentPercentage: percentage,
        lastAdjustmentAt: now,
      },
    });
  }
}
