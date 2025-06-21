import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecurringFinancial } from '@prisma/client';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateRecurringFinancialDto } from './dto/update-recurring-financial.dto';

@Injectable()
export class RecurringFinancialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async findAll(companyId: string) {
    const query = await this.qb.query('recurringFinancial');
    return this.prisma.recurringFinancial.findMany({
      ...query,
      where: { companyId },
    });
  }

  async findOne(id: string) {
    const financial = await this.prisma.recurringFinancial.findUnique({
      where: { id },
    });

    if (!financial) {
      throw new NotFoundException('Lançamento não encontrado');
    }

    return financial;
  }

  async update(id: string, updateEntryDto: UpdateRecurringFinancialDto) {
    const financial = await this.prisma.recurringFinancial.findUnique({
      where: { id },
    });

    if (!financial) {
      throw new NotFoundException('Lançamento não encontrado');
    }

    const data = Object.entries(updateEntryDto).reduce((acc, [key, value]) => {
      if (!value) {
        return acc;
      }

      if (key?.includes('Id')) {
        const newKey = key.replace('Id', '');
        return { ...acc, [newKey]: { connect: { id: value } } };
      }

      return { ...acc, [key]: value };
    }, {} as RecurringFinancial);

    try {
      await this.prisma.recurringFinancial.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new BadRequestException(
        'Erro ao atualizar lançamento, verifique os dados enviados e tente novamente',
      );
    }
    return { ok: true };
  }

  async remove(id: string) {
    const financial = await this.prisma.recurringFinancial.findUnique({
      where: { id },
    });

    if (!financial) {
      throw new NotFoundException('Lançamento não encontrado');
    }

    await this.prisma.recurringFinancial.delete({
      where: { id },
    });

    return { ok: true };
  }
}
