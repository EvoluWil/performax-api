import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AdvanceStatusEnum,
  BudgetStatusEnum,
  FinanceFlowEnum,
  FinanceStatusEnum,
  OccurrenceStatusEnum,
  Prisma,
  TaskStatusEnum,
} from '@prisma/client';
import { differenceInCalendarDays, endOfDay, format, subDays } from 'date-fns';
import { CompanyPermissionService } from 'src/providers/permission/company-permission.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import {
  DashboardBucket,
  DashboardCountValue,
  DashboardFlowSlice,
  DashboardPriority,
  DashboardPriorityItem,
  DashboardResponse,
} from './dashboard.types';
import {
  DashboardWindow,
  DashboardWindowError,
  resolveDashboardWindow,
  startOfToday,
} from './dashboard.window';

const OPEN_TASK_STATUSES: TaskStatusEnum[] = [
  TaskStatusEnum.PENDING,
  TaskStatusEnum.APPROVED,
  TaskStatusEnum.OPEN,
  TaskStatusEnum.SCHEDULED,
  TaskStatusEnum.IN_PROGRESS,
  TaskStatusEnum.EXPIRED,
  TaskStatusEnum.EMERGENCY,
  TaskStatusEnum.IMPEDED,
];

const OPEN_OCCURRENCE_STATUSES: OccurrenceStatusEnum[] = [
  OccurrenceStatusEnum.PENDING,
  OccurrenceStatusEnum.APPROVED,
  OccurrenceStatusEnum.IN_PROGRESS,
];

const COMMERCIAL_STAGES: BudgetStatusEnum[] = [
  BudgetStatusEnum.PENDING,
  BudgetStatusEnum.APPROVED,
  BudgetStatusEnum.FINANCIAL,
  BudgetStatusEnum.CHARGED,
  BudgetStatusEnum.PAID,
  BudgetStatusEnum.COMPLETED,
];

const APPROVED_COMMERCIAL: BudgetStatusEnum[] = [
  BudgetStatusEnum.APPROVED,
  BudgetStatusEnum.FINANCIAL,
  BudgetStatusEnum.CHARGED,
  BudgetStatusEnum.PAID,
  BudgetStatusEnum.COMPLETED,
];

const OPEN_FINANCE: FinanceStatusEnum[] = [
  FinanceStatusEnum.PENDING,
  FinanceStatusEnum.APPROVED,
];

const BUCKETS: DashboardBucket['key'][] = ['1-7', '8-30', '31-60', '61+'];

const BUCKET_LABELS: Record<DashboardBucket['key'], string> = {
  '1-7': '1–7 dias',
  '8-30': '8–30 dias',
  '31-60': '31–60 dias',
  '61+': '61+ dias',
};

const PRIORITY_LIMIT = 20;

type NamedClient = { name: string } | null;

type PriorityRow = {
  id: string;
  protocol: string;
  title: string;
  value: number;
  date: Date | null;
  client: NamedClient;
};

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permission: CompanyPermissionService,
  ) {}

  async get(
    companyId: string,
    userId: string,
    month?: string,
  ): Promise<DashboardResponse> {
    if (!/^[a-f\d]{24}$/i.test(companyId)) {
      throw new BadRequestException('Empresa inválida');
    }

    const now = new Date();
    const period = this.parseWindow(month, now);
    const today = startOfToday(now);
    const ctx = await this.permission.resolveContext(userId, companyId);
    const enabled = await this.enabledModules(companyId);
    const can = (code: string) =>
      enabled.has(code) && this.permission.hasPageAccess(ctx, code);

    const canTask = can('task');
    const canOccurrence = can('occurrence');
    const canFinancial = can('financial');
    const canBudget = can('budget');

    const [tasks, occurrences, financial, commercial] = await Promise.all([
      canTask ? this.tasks(companyId, ctx, period, today) : null,
      canOccurrence ? this.occurrences(companyId, ctx, period) : null,
      canFinancial ? this.financial(companyId, period, today) : null,
      canBudget ? this.commercial(companyId, ctx, period) : null,
    ]);

    const candidates: Array<DashboardPriority | undefined> = [
      tasks?.priorities.expired,
      financial?.receivablePriority,
      tasks?.priorities.impeded,
      commercial?.negotiationPriority,
    ];
    const priorities = candidates.filter(
      (item): item is DashboardPriority => Boolean(item && item.count > 0),
    );

    return {
      window: {
        month: period.month,
        from: period.from.toISOString(),
        to: period.to.toISOString(),
        previousFrom: period.previousFrom.toISOString(),
        previousTo: period.previousTo.toISOString(),
        complete: period.complete,
        forecastTo: period.forecastTo.toISOString(),
      },
      overview: {
        cards: {
          openTasks: tasks
            ? { count: tasks.open, expired: tasks.attention.expired }
            : null,
          punctuality: tasks?.punctuality ?? null,
          overdueReceivables: financial
            ? {
                count: financial.overdueReceivables.count,
                value: financial.overdueReceivables.value,
              }
            : null,
          negotiation: commercial?.negotiation ?? null,
          result: financial
            ? {
                current: financial.comparison.current.result,
                previous: financial.comparison.previous.result,
              }
            : null,
          impeded: tasks ? { count: tasks.attention.impeded } : null,
        },
        priorities,
      },
      operations:
        tasks || occurrences
          ? {
              tasks: tasks
                ? {
                    queue: tasks.queue,
                    open: tasks.open,
                    attention: tasks.attention,
                    throughput: tasks.throughput,
                    punctuality: tasks.punctuality,
                    overdueByDueMonth: tasks.overdueByDueMonth,
                  }
                : null,
              occurrences,
            }
          : null,
      financial: financial
        ? {
            comparison: financial.comparison,
            forecast: financial.forecast,
            overdueReceivables: financial.overdueReceivables,
            overduePayables: financial.overduePayables,
            wallet: financial.wallet,
            advances: financial.advances,
          }
        : null,
      commercial: commercial
        ? {
            stages: commercial.stages,
            rejected: commercial.rejected,
            created: commercial.created,
            negotiation: commercial.negotiation,
            approval: commercial.approval,
          }
        : null,
    };
  }

  private parseWindow(month: string | undefined, now: Date) {
    try {
      return resolveDashboardWindow(month, now);
    } catch (error) {
      if (error instanceof DashboardWindowError) {
        if (error.code === 'FUTURE_MONTH') {
          throw new BadRequestException('Mês futuro não é permitido');
        }
        throw new BadRequestException('Mês inválido. Use YYYY-MM.');
      }
      throw error;
    }
  }

  private async enabledModules(companyId: string) {
    const rows = await this.prisma.companyModule.findMany({
      where: { companyId },
      select: { module: { select: { code: true, deleted: true } } },
    });

    return new Set(
      rows
        .filter((row) => row.module && !row.module.deleted)
        .map((row) => row.module.code.toLowerCase()),
    );
  }

  private taskWhere(
    companyId: string,
    ctx: Awaited<ReturnType<CompanyPermissionService['resolveContext']>>,
    extra: Prisma.CompanyTaskWhereInput = {},
  ): Prisma.CompanyTaskWhereInput {
    const where: Prisma.CompanyTaskWhereInput = {
      companyId,
      deleted: false,
      ...extra,
    };
    this.permission.applyResponsibleScopeToWhere(
      where as Record<string, unknown>,
      ctx,
      'task',
    );
    return where;
  }

  private budgetWhere(
    companyId: string,
    ctx: Awaited<ReturnType<CompanyPermissionService['resolveContext']>>,
    extra: Prisma.CompanyBudgetWhereInput = {},
  ): Prisma.CompanyBudgetWhereInput {
    const where: Prisma.CompanyBudgetWhereInput = {
      companyId,
      deleted: false,
      ...extra,
    };
    this.permission.applyResponsibleScopeToWhere(
      where as Record<string, unknown>,
      ctx,
      'budget',
    );
    return where;
  }

  private occurrenceWhere(
    companyId: string,
    ctx: Awaited<ReturnType<CompanyPermissionService['resolveContext']>>,
    extra: Prisma.CompanyOccurrenceWhereInput = {},
  ): Prisma.CompanyOccurrenceWhereInput {
    const where: Prisma.CompanyOccurrenceWhereInput = {
      companyId,
      deleted: false,
      ...extra,
    };

    if (!ctx.isAdmin) {
      const ids = this.permission.getScopedUserIds(ctx, 'occurrence');
      if (ids !== null) where.createdById = { in: ids };
    }

    return where;
  }

  private async tasks(
    companyId: string,
    ctx: Awaited<ReturnType<CompanyPermissionService['resolveContext']>>,
    period: DashboardWindow,
    today: Date,
  ) {
    const base = this.taskWhere(companyId, ctx);
    const queueCounts = await Promise.all(
      OPEN_TASK_STATUSES.map(async (status) => ({
        status,
        count: await this.prisma.companyTask.count({
          where: { ...base, status },
        }),
      })),
    );
    const open = queueCounts.reduce((sum, item) => sum + item.count, 0);
    const countOf = (status: TaskStatusEnum) =>
      queueCounts.find((item) => item.status === status)?.count ?? 0;

    const [awaitingApproval, throughput, punctuality, overdueDates, expiredRows, impededRows] =
      await Promise.all([
        this.prisma.companyTask.count({
          where: {
            ...base,
            approved: false,
            status: { notIn: [TaskStatusEnum.CLOSED, TaskStatusEnum.REJECTED] },
          },
        }),
        this.throughput(base, period),
        this.punctuality(base, period),
        this.prisma.companyTask.findMany({
          where: {
            ...base,
            status: { notIn: [TaskStatusEnum.CLOSED, TaskStatusEnum.REJECTED] },
            date: { lt: today },
          },
          select: { date: true },
        }),
        this.taskItems({ ...base, status: TaskStatusEnum.EXPIRED }),
        this.taskItems({ ...base, status: TaskStatusEnum.IMPEDED }),
      ]);

    const overdueByDueMonth = this.groupByMonth(
      overdueDates.map((row) => row.date).filter((date): date is Date => Boolean(date)),
    );

    return {
      queue: queueCounts,
      open,
      attention: {
        awaitingApproval,
        expired: countOf(TaskStatusEnum.EXPIRED),
        emergency: countOf(TaskStatusEnum.EMERGENCY),
        impeded: countOf(TaskStatusEnum.IMPEDED),
      },
      throughput,
      punctuality,
      overdueByDueMonth,
      priorities: {
        expired: {
          id: 'expired-tasks' as const,
          severity: 'high' as const,
          label: 'OS com prazo vencido',
          count: expiredRows.count,
          value: expiredRows.value,
          money: 'unit' as const,
          href: '/panel/tasks?status=EXPIRED',
          items: expiredRows.items,
        },
        impeded: {
          id: 'impeded-tasks' as const,
          severity: 'medium' as const,
          label: 'OS impedidas',
          count: impededRows.count,
          value: impededRows.value,
          money: 'unit' as const,
          href: '/panel/tasks?status=IMPEDED',
          items: impededRows.items,
        },
      },
    };
  }

  private async taskItems(where: Prisma.CompanyTaskWhereInput) {
    const [count, rows, total] = await Promise.all([
      this.prisma.companyTask.count({ where }),
      this.prisma.companyTask.findMany({
        where,
        orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
        take: PRIORITY_LIMIT,
        select: {
          id: true,
          protocol: true,
          title: true,
          value: true,
          date: true,
          client: { select: { name: true } },
        },
      }),
      this.prisma.companyTask.aggregate({ where, _sum: { value: true } }),
    ]);

    return {
      count,
      value: total._sum.value ?? 0,
      items: rows.map((row) => this.toItem(row)),
    };
  }

  private async throughput(
    base: Prisma.CompanyTaskWhereInput,
    period: DashboardWindow,
  ) {
    const [currentCreated, currentClosed, previousCreated, previousClosed] =
      await Promise.all([
        this.prisma.companyTask.count({
          where: { ...base, createdAt: { gte: period.from, lte: period.to } },
        }),
        this.prisma.companyTask.count({
          where: {
            ...base,
            status: TaskStatusEnum.CLOSED,
            completedAt: { gte: period.from, lte: period.to },
          },
        }),
        this.prisma.companyTask.count({
          where: {
            ...base,
            createdAt: { gte: period.previousFrom, lte: period.previousTo },
          },
        }),
        this.prisma.companyTask.count({
          where: {
            ...base,
            status: TaskStatusEnum.CLOSED,
            completedAt: { gte: period.previousFrom, lte: period.previousTo },
          },
        }),
      ]);

    return {
      current: { created: currentCreated, closed: currentClosed },
      previous: { created: previousCreated, closed: previousClosed },
    };
  }

  private async punctuality(
    base: Prisma.CompanyTaskWhereInput,
    period: DashboardWindow,
  ) {
    const [current, previous] = await Promise.all([
      this.punctualityWindow(base, period.from, period.to),
      this.punctualityWindow(base, period.previousFrom, period.previousTo),
    ]);

    return {
      onTime: current.onTime,
      total: current.total,
      previousOnTime: previous.onTime,
      previousTotal: previous.total,
    };
  }

  private async punctualityWindow(
    base: Prisma.CompanyTaskWhereInput,
    from: Date,
    to: Date,
  ) {
    const rows = await this.prisma.companyTask.findMany({
      where: {
        ...base,
        status: TaskStatusEnum.CLOSED,
        completedAt: { gte: from, lte: to },
        date: { not: null },
      },
      select: { completedAt: true, date: true },
    });

    const onTime = rows.filter(
      (row) => row.completedAt && row.date && row.completedAt.getTime() <= row.date.getTime(),
    ).length;

    return { onTime, total: rows.length };
  }

  private async occurrences(
    companyId: string,
    ctx: Awaited<ReturnType<CompanyPermissionService['resolveContext']>>,
    period: DashboardWindow,
  ) {
    const base = this.occurrenceWhere(companyId, ctx);
    const [byStatus, awaitingApproval, current, previous] = await Promise.all([
      Promise.all(
        OPEN_OCCURRENCE_STATUSES.map(async (status) => ({
          status,
          count: await this.prisma.companyOccurrence.count({
            where: { ...base, status },
          }),
        })),
      ),
      this.prisma.companyOccurrence.count({
        where: {
          ...base,
          approved: false,
          status: { notIn: [OccurrenceStatusEnum.COMPLETED, OccurrenceStatusEnum.REJECTED] },
        },
      }),
      this.prisma.companyOccurrence.count({
        where: {
          ...base,
          status: OccurrenceStatusEnum.COMPLETED,
          completedAt: { gte: period.from, lte: period.to },
        },
      }),
      this.prisma.companyOccurrence.count({
        where: {
          ...base,
          status: OccurrenceStatusEnum.COMPLETED,
          completedAt: { gte: period.previousFrom, lte: period.previousTo },
        },
      }),
    ]);

    return {
      open: byStatus.reduce((sum, item) => sum + item.count, 0),
      awaitingApproval,
      byStatus,
      completed: { current, previous },
    };
  }

  private async financial(companyId: string, period: DashboardWindow, today: Date) {
    const [current, previous, forecast, overdue, wallet, advances, receivableItems] =
      await Promise.all([
        this.financeSlice(companyId, period.from, period.to),
        this.financeSlice(companyId, period.previousFrom, period.previousTo),
        period.complete
          ? Promise.resolve(null)
          : this.financeSlice(companyId, period.from, period.forecastTo),
        this.overdueFinance(companyId, today),
        this.prisma.companyFinanceWallet.findFirst({
          where: { companyId },
          select: { amount: true },
        }),
        this.prisma.companyFinanceAdvance.aggregate({
          where: {
            companyId,
            status: { in: [AdvanceStatusEnum.OPEN, AdvanceStatusEnum.PARTIAL] },
          },
          _sum: { remainingValue: true },
          _count: true,
        }),
        this.financeItems(companyId, FinanceFlowEnum.IN, today),
      ]);

    return {
      comparison: { current, previous },
      forecast,
      overdueReceivables: overdue.receivables,
      overduePayables: overdue.payables,
      wallet: wallet?.amount ?? 0,
      advances: {
        count: advances._count,
        value: advances._sum.remainingValue ?? 0,
      },
      receivablePriority: {
        id: 'overdue-receivables' as const,
        severity: 'high' as const,
        label: 'Recebimentos vencidos',
        count: receivableItems.count,
        value: receivableItems.value,
        money: 'cents' as const,
        href: this.overdueFinanceHref(FinanceFlowEnum.IN, today),
        items: receivableItems.items,
      },
    };
  }

  private financeBase(companyId: string): Prisma.CompanyFinanceWhereInput {
    return {
      companyId,
      deleted: false,
      isInstallment: false,
      paidFromAdvance: false,
    };
  }

  private async financeSlice(
    companyId: string,
    from: Date,
    to: Date,
  ): Promise<DashboardFlowSlice> {
    const base: Prisma.CompanyFinanceWhereInput = {
      ...this.financeBase(companyId),
      date: { gte: from, lte: to },
    };
    const [inPaid, inOpen, outPaid, outOpen] = await Promise.all([
      this.sumFinance({ ...base, flow: FinanceFlowEnum.IN, status: FinanceStatusEnum.PAID }),
      this.sumFinance({
        ...base,
        flow: FinanceFlowEnum.IN,
        status: { in: OPEN_FINANCE },
      }),
      this.sumFinance({ ...base, flow: FinanceFlowEnum.OUT, status: FinanceStatusEnum.PAID }),
      this.sumFinance({
        ...base,
        flow: FinanceFlowEnum.OUT,
        status: { in: OPEN_FINANCE },
      }),
    ]);
    const incoming = inPaid + inOpen;
    const outgoing = outPaid + outOpen;

    return {
      in: incoming,
      out: outgoing,
      result: incoming - outgoing,
      inPaid,
      inOpen,
      outPaid,
      outOpen,
    };
  }

  private async sumFinance(where: Prisma.CompanyFinanceWhereInput) {
    const result = await this.prisma.companyFinance.aggregate({
      where,
      _sum: { value: true },
    });
    return result._sum.value ?? 0;
  }

  private async overdueFinance(companyId: string, today: Date) {
    const rows = await this.prisma.companyFinance.findMany({
      where: {
        ...this.financeBase(companyId),
        flow: { in: [FinanceFlowEnum.IN, FinanceFlowEnum.OUT] },
        status: { in: OPEN_FINANCE },
        date: { lt: today },
      },
      select: { date: true, value: true, flow: true },
    });

    const receivables = rows.filter((row) => row.flow === FinanceFlowEnum.IN);
    const payables = rows.filter((row) => row.flow === FinanceFlowEnum.OUT);

    return {
      receivables: this.bucketRows(receivables, today),
      payables: this.bucketRows(payables, today),
    };
  }

  private bucketRows(
    rows: { date: Date; value: number }[],
    today: Date,
  ): DashboardCountValue & { buckets: DashboardBucket[] } {
    const buckets = new Map<DashboardBucket['key'], DashboardBucket>(
      BUCKETS.map((key) => [key, { key, label: BUCKET_LABELS[key], count: 0, value: 0 }]),
    );

    for (const row of rows) {
      const days = Math.max(differenceInCalendarDays(today, row.date), 1);
      const key = this.bucketKey(Math.max(days, 1));
      const bucket = buckets.get(key);
      if (!bucket) continue;
      bucket.count += 1;
      bucket.value += row.value;
    }

    return {
      count: rows.length,
      value: rows.reduce((sum, row) => sum + row.value, 0),
      buckets: BUCKETS.map((key) => buckets.get(key)!),
    };
  }

  private bucketKey(days: number): DashboardBucket['key'] {
    if (days <= 7) return '1-7';
    if (days <= 30) return '8-30';
    if (days <= 60) return '31-60';
    return '61+';
  }

  private async financeItems(
    companyId: string,
    flow: FinanceFlowEnum,
    today: Date,
  ) {
    const where: Prisma.CompanyFinanceWhereInput = {
      ...this.financeBase(companyId),
      flow,
      status: { in: OPEN_FINANCE },
      date: { lt: today },
    };
    const [count, rows, total] = await Promise.all([
      this.prisma.companyFinance.count({ where }),
      this.prisma.companyFinance.findMany({
        where,
        orderBy: { date: 'asc' },
        take: PRIORITY_LIMIT,
        select: {
          id: true,
          protocol: true,
          title: true,
          value: true,
          date: true,
          client: { select: { name: true } },
        },
      }),
      this.prisma.companyFinance.aggregate({ where, _sum: { value: true } }),
    ]);

    return {
      count,
      value: total._sum.value ?? 0,
      items: rows.map((row) => this.toItem(row)),
    };
  }

  private overdueFinanceHref(flow: FinanceFlowEnum, today: Date) {
    const dateTo = endOfDay(subDays(today, 1));
    const params = new URLSearchParams({
      flow,
      statuses: `${FinanceStatusEnum.PENDING},${FinanceStatusEnum.APPROVED}`,
      dateFrom: new Date(2000, 0, 1).toISOString(),
      dateTo: dateTo.toISOString(),
    });
    return `/panel/financial?${params.toString()}`;
  }

  private async commercial(
    companyId: string,
    ctx: Awaited<ReturnType<CompanyPermissionService['resolveContext']>>,
    period: DashboardWindow,
  ) {
    const base = this.budgetWhere(companyId, ctx);
    const [stages, rejected, createdCurrent, createdPrevious, negotiation, negotiationItems] =
      await Promise.all([
        Promise.all(
          COMMERCIAL_STAGES.map(async (status) => {
            const result = await this.prisma.companyBudget.aggregate({
              where: { ...base, status },
              _count: true,
              _sum: { value: true },
            });
            return {
              status,
              count: result._count,
              value: result._sum.value ?? 0,
            };
          }),
        ),
        this.prisma.companyBudget.count({
          where: { ...base, status: BudgetStatusEnum.REJECTED },
        }),
        this.createdBudgets(base, period.from, period.to),
        this.createdBudgets(base, period.previousFrom, period.previousTo),
        this.negotiation(base),
        this.budgetItems({ ...base, approved: false }),
      ]);

    const approved = stages
      .filter((stage) => APPROVED_COMMERCIAL.includes(stage.status as BudgetStatusEnum))
      .reduce((sum, stage) => sum + stage.count, 0);

    return {
      stages,
      rejected,
      created: { current: createdCurrent, previous: createdPrevious },
      negotiation,
      approval: { approved, rejected },
      negotiationPriority: {
        id: 'budgets-awaiting' as const,
        severity: 'medium' as const,
        label: 'Orçamentos aguardando aprovação',
        count: negotiationItems.count,
        value: negotiationItems.value,
        money: 'cents' as const,
        href: '/panel/budgets?awaitingDecision=1',
        items: negotiationItems.items,
      },
    };
  }

  private async createdBudgets(
    base: Prisma.CompanyBudgetWhereInput,
    from: Date,
    to: Date,
  ): Promise<DashboardCountValue> {
    const result = await this.prisma.companyBudget.aggregate({
      where: { ...base, createdAt: { gte: from, lte: to } },
      _count: true,
      _sum: { value: true },
    });
    return { count: result._count, value: result._sum.value ?? 0 };
  }

  private async negotiation(
    base: Prisma.CompanyBudgetWhereInput,
  ): Promise<DashboardCountValue> {
    const result = await this.prisma.companyBudget.aggregate({
      where: { ...base, approved: false },
      _count: true,
      _sum: { value: true },
    });
    return { count: result._count, value: result._sum.value ?? 0 };
  }

  private async budgetItems(where: Prisma.CompanyBudgetWhereInput) {
    const [count, rows, total] = await Promise.all([
      this.prisma.companyBudget.count({ where }),
      this.prisma.companyBudget.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        take: PRIORITY_LIMIT,
        select: {
          id: true,
          protocol: true,
          title: true,
          value: true,
          createdAt: true,
          client: { select: { name: true } },
        },
      }),
      this.prisma.companyBudget.aggregate({ where, _sum: { value: true } }),
    ]);

    return {
      count,
      value: total._sum.value ?? 0,
      items: rows.map((row) =>
        this.toItem({
          id: row.id,
          protocol: row.protocol,
          title: row.title,
          value: row.value,
          date: row.createdAt,
          client: row.client,
        }),
      ),
    };
  }

  private toItem(row: PriorityRow): DashboardPriorityItem {
    return {
      id: row.id,
      protocol: row.protocol,
      title: row.title,
      value: row.value ?? 0,
      date: row.date ? row.date.toISOString() : null,
      clientName: row.client?.name ?? null,
    };
  }

  private groupByMonth(dates: Date[]) {
    const counts = new Map<string, number>();
    for (const date of dates) {
      const key = format(date, 'yyyy-MM');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([month, count]) => ({ month, count }));
  }
}
