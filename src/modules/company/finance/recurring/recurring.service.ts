import { Injectable, NotFoundException } from '@nestjs/common';
import { FinanceStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { UpdateRecurringDto } from './dto/update-recurring.dto';

@Injectable()
export class RecurringService {
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

  async processRecurrences(companyId: string) {
    const recurrings = await this.prisma.companyFinanceRecurring.findMany({
      where: { companyId, recurrence: { not: null } },
    });

    const now = new Date();
    const created: string[] = [];

    for (const recurring of recurrings) {
      if (!recurring.recurrence) continue;

      const endDate = recurring.endDate ?? new Date('2100-01-01');
      if (now > endDate) continue;

      // Use rrule to get due dates since lastDate up to now
      const { RRule } = await import('rrule');
      const rule = RRule.fromString(recurring.recurrence);
      const dates = rule.between(recurring.lastDate, now, true);

      for (const dueDate of dates) {
        const protocol = await this.util.generateUniqueProtocol(
          'companyFinance',
        );

        await this.prisma.companyFinance.create({
          data: {
            title: recurring.title,
            description: recurring.description,
            value: recurring.value,
            date: dueDate,
            flow: recurring.flow,
            observation: recurring.observation,
            status: FinanceStatusEnum.PENDING,
            approved: true,
            protocol,
            recurrenceMasterId: recurring.id,
            company: { connect: { id: companyId } },
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
        } as any);

        created.push(protocol);
      }

      if (dates.length > 0) {
        await this.prisma.companyFinanceRecurring.update({
          where: { id: recurring.id },
          data: { lastDate: dates[dates.length - 1] },
        });
      }
    }

    return {
      processed: recurrings.length,
      created: created.length,
      protocols: created,
    };
  }
}
