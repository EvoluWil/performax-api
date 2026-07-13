import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  CompanyFinanceRecurring,
  FinanceStatusEnum,
} from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { UpdateRecurringDto } from './dto/update-recurring.dto';

const MAX_EAGER = 100;

@Injectable()
export class RecurringService {
  private readonly logger = new Logger(RecurringService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}

  async findAll(companyId: string) {
    return this.prisma.companyFinanceRecurring.findMany({
      where: { companyId },
    });
  }

  async findOne(recurringId: string, companyId: string) {
    const recurring = await this.prisma.companyFinanceRecurring.findFirst({
      where: { id: recurringId, companyId },
    });

    if (!recurring) throw new NotFoundException('Recorrência não encontrada');
    return recurring;
  }

  // ---------------------------------------------------------------------------
  // Eager generation
  // ---------------------------------------------------------------------------

  /**
   * Generates all occurrences for a single recurring master, up to MAX_EAGER
   * when there is no endDate, or all occurrences up to endDate otherwise.
   *
   * Idempotent: existing (recurrenceMasterId, date) pairs are skipped.
   * Updates `lastDate` on the master after each run.
   */
  async generateEager(
    recurring: CompanyFinanceRecurring,
    createdById: string,
    responsibleId: string | null,
  ): Promise<{ created: number; protocols: string[] }> {
    if (!recurring.recurrence) return { created: 0, protocols: [] };

    const { RRule } = await import('rrule');

    let rule: InstanceType<typeof RRule>;
    try {
      rule = RRule.fromString(recurring.recurrence);
    } catch {
      this.logger.warn(
        `Invalid RRULE on recurring ${recurring.id}, skipping eager generation`,
      );
      return { created: 0, protocols: [] };
    }

    // Determine the full set of occurrences to target
    let occurrences: Date[];
    if (recurring.endDate) {
      occurrences = rule.between(
        recurring.date,
        recurring.endDate,
        true,
      ) as Date[];
    } else {
      occurrences = rule.all((_, len) => len < MAX_EAGER) as Date[];
    }

    if (occurrences.length === 0) return { created: 0, protocols: [] };

    // Skip already-existing ones (idempotency)
    const existing = await this.prisma.companyFinance.findMany({
      where: {
        recurrenceMasterId: recurring.id,
        date: { in: occurrences },
        deleted: false,
      },
      select: { date: true },
    });
    const existingTimes = new Set(existing.map((e) => e.date.getTime()));
    const toCreate = occurrences.filter(
      (d) => !existingTimes.has(d.getTime()),
    );

    if (toCreate.length === 0) return { created: 0, protocols: [] };

    const protocols = await this.util.generateUniqueProtocols(
      'companyFinance',
      toCreate.length,
    );

    await this.prisma.companyFinance.createMany({
      data: toCreate.map((dueDate, index) => ({
        title: recurring.title,
        description: recurring.description ?? undefined,
        value: recurring.value,
        date: dueDate,
        flow: recurring.flow,
        observation: recurring.observation ?? undefined,
        status: FinanceStatusEnum.PENDING,
        approved: true,
        recurrenceMasterId: recurring.id,
        createdById,
        companyId: recurring.companyId,
        protocol: protocols[index],
        responsibleId: responsibleId ?? undefined,
        typeId: recurring.typeId ?? undefined,
        bankId: recurring.bankId!,
        methodId: recurring.methodId!,
        categoryId: recurring.categoryId ?? undefined,
        segmentId: recurring.segmentId ?? undefined,
        payeeId: recurring.payeeId ?? undefined,
        clientId: recurring.clientId ?? undefined,
        employeeId: recurring.employeeId ?? undefined,
      })),
    });

    // Advance the high-water mark to the last occurrence
    const lastOcc = occurrences[occurrences.length - 1];
    await this.prisma.companyFinanceRecurring.update({
      where: { id: recurring.id },
      data: { lastDate: lastOcc },
    });

    return { created: protocols.length, protocols };
  }

  /**
   * Resolves createdById and responsibleId from the first linked CompanyFinance
   * of the master, then calls generateEager.
   * Used by finance.service after creating the master.
   */
  async generateEagerForMaster(
    recurringId: string,
    companyId: string,
  ): Promise<{ created: number; protocols: string[] }> {
    const recurring = await this.findOne(recurringId, companyId);

    const firstFinance = await this.prisma.companyFinance.findFirst({
      where: { recurrenceMasterId: recurringId },
      select: { createdById: true, responsibleId: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!firstFinance?.createdById) {
      this.logger.warn(
        `Recurring ${recurringId} has no linked finance with createdById; skipping eager generation`,
      );
      return { created: 0, protocols: [] };
    }

    return this.generateEager(
      recurring,
      firstFinance.createdById,
      firstFinance.responsibleId ?? null,
    );
  }

  /**
   * Runs eager generation for every recurring master in the company.
   * Safe to call multiple times (idempotent).
   * Used by the backfill route and script.
   */
  async backfillAll(companyId: string) {
    const recurrings = await this.prisma.companyFinanceRecurring.findMany({
      where: { companyId, recurrence: { not: null } },
    });

    const masterIds = recurrings.map((r) => r.id);
    const firstFinances = await this.prisma.companyFinance.findMany({
      where: { recurrenceMasterId: { in: masterIds } },
      select: { recurrenceMasterId: true, createdById: true, responsibleId: true },
      orderBy: { createdAt: 'asc' },
    });

    const createdByMap = new Map<string, string>();
    const responsibleMap = new Map<string, string | null>();
    for (const f of firstFinances) {
      if (!f.recurrenceMasterId || createdByMap.has(f.recurrenceMasterId))
        continue;
      createdByMap.set(f.recurrenceMasterId, f.createdById);
      responsibleMap.set(f.recurrenceMasterId, f.responsibleId ?? null);
    }

    let totalCreated = 0;
    const results: Array<{ recurringId: string; created: number }> = [];

    for (const recurring of recurrings) {
      const createdById = createdByMap.get(recurring.id);
      if (!createdById) {
        this.logger.warn(
          `Recurring ${recurring.id} has no linked finance; skipping backfill`,
        );
        continue;
      }

      try {
        const result = await this.generateEager(
          recurring,
          createdById,
          responsibleMap.get(recurring.id) ?? null,
        );
        totalCreated += result.created;
        results.push({ recurringId: recurring.id, created: result.created });
      } catch (err) {
        this.logger.error(`Backfill failed for recurring ${recurring.id}`, err);
      }
    }

    return { processed: recurrings.length, totalCreated, results };
  }

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  async update(
    recurringId: string,
    companyId: string,
    updateRecurringDto: UpdateRecurringDto,
  ) {
    await this.findOne(recurringId, companyId);

    const data = normalizeRelations(updateRecurringDto) as Record<
      string,
      unknown
    >;

    const now = new Date();

    // Propagate scalar & relation changes to future pending/approved finances
    const financeUpdateData: Record<string, unknown> = {};

    const scalarFields = [
      'title',
      'description',
      'observation',
      'value',
      'flow',
    ] as const;
    for (const field of scalarFields) {
      if (updateRecurringDto[field] !== undefined) {
        financeUpdateData[field] = updateRecurringDto[field] ?? null;
      }
    }

    const relationFields = [
      'typeId',
      'bankId',
      'methodId',
      'categoryId',
      'segmentId',
      'payeeId',
      'clientId',
    ] as const;
    for (const field of relationFields) {
      if (updateRecurringDto[field] !== undefined) {
        financeUpdateData[field] = updateRecurringDto[field] || null;
      }
    }

    if (Object.keys(financeUpdateData).length > 0) {
      await this.prisma.companyFinance.updateMany({
        where: {
          recurrenceMasterId: recurringId,
          date: { gte: now },
          status: {
            in: [FinanceStatusEnum.PENDING, FinanceStatusEnum.APPROVED],
          },
        },
        data: financeUpdateData,
      });
    }

    // If the recurrence rule changed, wipe future pending entries and
    // regenerate eagerly from the new rule
    let regenerated: { created: number; protocols: string[] } | null = null;
    if (updateRecurringDto.recurrence !== undefined) {
      await this.prisma.companyFinance.deleteMany({
        where: {
          recurrenceMasterId: recurringId,
          date: { gte: now },
          status: {
            in: [FinanceStatusEnum.PENDING, FinanceStatusEnum.APPROVED],
          },
        },
      });

      // Reset lastDate to the master's original date so generateEager
      // starts from the beginning (idempotency handles already-paid ones)
      data.lastDate = now;
    }

    const updated = await this.prisma.companyFinanceRecurring.update({
      where: { id: recurringId },
      data,
    });

    if (updateRecurringDto.recurrence !== undefined) {
      regenerated = await this.generateEagerForMaster(recurringId, companyId);
    }

    return { ...updated, regenerated };
  }

  async remove(recurringId: string, companyId: string) {
    await this.findOne(recurringId, companyId);

    const now = new Date();
    await this.prisma.companyFinance.deleteMany({
      where: {
        recurrenceMasterId: recurringId,
        date: { gte: now },
        status: {
          in: [FinanceStatusEnum.PENDING, FinanceStatusEnum.APPROVED],
        },
      },
    });

    return this.prisma.companyFinanceRecurring.delete({
      where: { id: recurringId },
    });
  }

  /** Legacy endpoint kept for compatibility. */
  async processRecurrences(companyId: string) {
    return this.backfillAll(companyId);
  }
}
