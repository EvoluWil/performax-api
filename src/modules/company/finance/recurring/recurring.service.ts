import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { UpdateRecurringDto } from './dto/update-recurring.dto';

@Injectable()
export class RecurringService {
  constructor(private readonly prisma: PrismaService) {}
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
}
