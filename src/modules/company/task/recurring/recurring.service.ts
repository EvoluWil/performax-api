import { Injectable, Logger } from '@nestjs/common';
import { TaskStatusEnum } from '@prisma/client';
import { RRule, rrulestr } from 'rrule';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';

@Injectable()
export class RecurringService {
  private readonly logger = new Logger(RecurringService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}

  async findAll(companyId: string) {
    const masters = await this.prisma.companyTask.findMany({
      where: { companyId, deleted: false, recurrence: { not: null } },
    });

    return masters;
  }

  async processDueRecurrences(companyId: string) {
    const now = new Date();

    const masters = await this.prisma.companyTask.findMany({
      where: {
        companyId,
        deleted: false,
        recurrence: { not: null },
        recurrenceIsGenerated: false,
      },
    });

    const createdTasks = [];

    for (const master of masters) {
      try {
        const rruleString = master.recurrence as string;

        let rule: RRule | null = null;
        try {
          rule = rrulestr(rruleString) as RRule;
        } catch (e) {
          this.logger.warn(`Invalid RRULE on task ${master.id}, skipping`);
          continue;
        }

        const after = master.recurrenceOriginalDate || new Date(0);
        const next = rule.after(after, true);
        if (!next) continue;

        if (next.getTime() <= now.getTime()) {
          const protocol = await this.util.generateUniqueProtocol(
            'companyTask',
          );
          const taskType = master.typeId
            ? await this.prisma.companyTaskType.findUnique({
                where: { id: master.typeId },
              })
            : null;

          const existing = await this.prisma.companyTask.findFirst({
            where: {
              recurrenceMasterId: master.id,
              recurrenceOriginalDate: next,
              recurrenceIsGenerated: true,
            },
          });

          if (existing) {
            await this.prisma.companyTask.update({
              where: { id: master.id },
              data: { recurrenceOriginalDate: next },
            });

            continue;
          }

          const taskCreateData = {
            title: master.title,
            description: master.description,
            internalNote: master.internalNote,
            date: next,
            protocol,
            company: { connect: { id: master.companyId } },
            createdBy: { connect: { id: master.createdById } },
            type: master.typeId
              ? { connect: { id: master.typeId } }
              : undefined,
            client: master.clientId
              ? { connect: { id: master.clientId } }
              : undefined,
            responsible: master.responsibleId
              ? { connect: { id: master.responsibleId } }
              : undefined,
            status: TaskStatusEnum.PENDING,
            approved: taskType?.needApprove ? false : true,
            recurrenceMasterId: master.id,
            recurrenceOriginalDate: next,
            recurrenceIsGenerated: true,
          };

          const created = await this.prisma.companyTask.create({
            data: taskCreateData,
          });

          await this.prisma.companyTask.update({
            where: { id: master.id },
            data: { recurrenceOriginalDate: next },
          });

          createdTasks.push(created);
        }
      } catch (err) {
        this.logger.error('Error processing recurrence ' + master.id, err);
      }
    }

    return createdTasks;
  }

  async generateForNextDays(companyId: string, days = 7) {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const masters = await this.prisma.companyTask.findMany({
      where: {
        companyId,
        deleted: false,
        recurrence: { not: null },
        recurrenceIsGenerated: false,
      },
    });
    const createdTasks = [];

    for (const master of masters) {
      try {
        const rruleString = master.recurrence as string;

        let rule: RRule | null = null;
        try {
          rule = rrulestr(rruleString) as RRule;
        } catch (e) {
          this.logger.warn(`Invalid RRULE on task ${master.id}, skipping`);
          continue;
        }

        const occurrences = rule.between(now, windowEnd, true) as Date[];
        if (!occurrences || occurrences.length === 0) continue;

        const taskType = master.typeId
          ? await this.prisma.companyTaskType.findUnique({
              where: { id: master.typeId },
            })
          : null;

        let lastCreated: Date | null = null;

        for (const occ of occurrences) {
          const existing = await this.prisma.companyTask.findFirst({
            where: {
              recurrenceMasterId: master.id,
              recurrenceOriginalDate: occ,
              recurrenceIsGenerated: true,
            },
          });

          if (existing) continue;

          const protocol = await this.util.generateUniqueProtocol(
            'companyTask',
          );

          const taskCreateData = {
            title: master.title,
            description: master.description,
            internalNote: master.internalNote,
            date: occ,
            protocol,
            company: { connect: { id: master.companyId } },
            createdBy: { connect: { id: master.createdById } },
            type: master.typeId
              ? { connect: { id: master.typeId } }
              : undefined,
            client: master.clientId
              ? { connect: { id: master.clientId } }
              : undefined,
            responsible: master.responsibleId
              ? { connect: { id: master.responsibleId } }
              : undefined,
            status: TaskStatusEnum.PENDING,
            approved: taskType?.needApprove ? false : true,
            recurrenceMasterId: master.id,
            recurrenceOriginalDate: occ,
            recurrenceIsGenerated: true,
          };

          const created = await this.prisma.companyTask.create({
            data: taskCreateData,
          });
          createdTasks.push(created);

          lastCreated = occ;
        }

        if (lastCreated) {
          await this.prisma.companyTask.update({
            where: { id: master.id },
            data: { recurrenceOriginalDate: lastCreated },
          });
        }
      } catch (err) {
        this.logger.error(
          'Error generating weekly recurrences for ' + master.id,
          err,
        );
      }
    }

    return createdTasks;
  }
}
