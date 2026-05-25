import { Injectable, Logger } from '@nestjs/common';
import { TaskStatusEnum } from '@prisma/client';
import { RRule, rrulestr } from 'rrule';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';

const DAY_MS = 24 * 60 * 60 * 1000;

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

          const created = await this.util.createWithUniqueProtocol(
            'companyTask',
            taskCreateData,
          );

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

  /**
   * Lazy generation: cria todas as ocorrências de tarefas-recorrentes que
   * deveriam existir na janela [now, now + days].
   *
   * Idempotente: já existindo a ocorrência (`recurrenceMasterId` +
   * `recurrenceOriginalDate`), pula. Após cada master, atualiza o
   * `recurrenceOriginalDate` do master para servir de high-water mark e
   * evitar reprocessar masters já cobertos em chamadas seguintes.
   */
  async generateForNextDays(companyId: string, days = 30) {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + days * DAY_MS);

    const masters = await this.prisma.companyTask.findMany({
      where: {
        companyId,
        deleted: false,
        recurrence: { not: null },
        recurrenceIsGenerated: false,
        OR: [
          { recurrenceOriginalDate: null },
          { recurrenceOriginalDate: { lt: windowEnd } },
        ],
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

        const baseline =
          master.recurrenceOriginalDate ?? master.date ?? master.createdAt;
        const occurrences = (
          rule.between(baseline, windowEnd, true) as Date[]
        ).filter((d) =>
          master.recurrenceOriginalDate
            ? d.getTime() > master.recurrenceOriginalDate.getTime()
            : true,
        );

        if (occurrences.length === 0) {
          await this.prisma.companyTask.update({
            where: { id: master.id },
            data: { recurrenceOriginalDate: windowEnd },
          });
          continue;
        }

        const existingItems = await this.prisma.companyTask.findMany({
          where: {
            recurrenceMasterId: master.id,
            recurrenceIsGenerated: true,
            recurrenceOriginalDate: { in: occurrences },
          },
          select: { recurrenceOriginalDate: true },
        });
        const existingTimes = new Set(
          existingItems
            .map((e) => e.recurrenceOriginalDate?.getTime())
            .filter((t): t is number => t !== undefined),
        );
        const toCreate = occurrences.filter(
          (o) => !existingTimes.has(o.getTime()),
        );

        const taskType = master.typeId
          ? await this.prisma.companyTaskType.findUnique({
              where: { id: master.typeId },
            })
          : null;

        for (const occ of toCreate) {
          const taskCreateData = {
            title: master.title,
            description: master.description,
            internalNote: master.internalNote,
            date: occ,
            company: { connect: { id: master.companyId } },
            createdBy: master.createdById
              ? { connect: { id: master.createdById } }
              : undefined,
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

          const created = await this.util.createWithUniqueProtocol(
            'companyTask',
            taskCreateData,
          );
          createdTasks.push(created);
        }

        const lastOcc = occurrences[occurrences.length - 1];
        const newMarker =
          lastOcc.getTime() > windowEnd.getTime() ? lastOcc : windowEnd;
        await this.prisma.companyTask.update({
          where: { id: master.id },
          data: { recurrenceOriginalDate: newMarker },
        });
      } catch (err) {
        this.logger.error(
          'Error generating recurrences for ' + master.id,
          err,
        );
      }
    }

    return createdTasks;
  }
}
