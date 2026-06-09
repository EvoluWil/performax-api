/**
 * Validates financial entries integrity after recurrence backfill and schema changes.
 *
 *   npx ts-node -r tsconfig-paths/register scripts/validate-finances.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const MAX_EAGER = 100;
const prisma = new PrismaClient();

type Issue = {
  severity: 'error' | 'warn';
  category: string;
  message: string;
  recurringId?: string;
  financeId?: string;
};

const issues: Issue[] = [];

function add(
  severity: Issue['severity'],
  category: string,
  message: string,
  extra?: Partial<Issue>,
) {
  issues.push({ severity, category, message, ...extra });
}

async function validateRecurrences() {
  const { RRule } = await import('rrule');

  const recurrings = await prisma.companyFinanceRecurring.findMany({
    where: { recurrence: { not: null } },
  });

  const masterIds = recurrings.map((r) => r.id);
  const allLinked = await prisma.companyFinance.findMany({
    where: { recurrenceMasterId: { in: masterIds }, deleted: false },
    select: { recurrenceMasterId: true, date: true, id: true },
  });

  const byMaster = new Map<string, { dates: number[]; ids: string[] }>();
  for (const f of allLinked) {
    if (!f.recurrenceMasterId) continue;
    const entry = byMaster.get(f.recurrenceMasterId) ?? { dates: [], ids: [] };
    entry.dates.push(f.date.getTime());
    entry.ids.push(f.id);
    byMaster.set(f.recurrenceMasterId, entry);
  }

  let mastersOk = 0;
  let mastersWithGaps = 0;
  let mastersSkipped = 0;

  const firstFinances = await prisma.companyFinance.findMany({
    where: { recurrenceMasterId: { in: masterIds } },
    select: { recurrenceMasterId: true, createdById: true },
    orderBy: { createdAt: 'asc' },
  });
  const hasLinkedFinance = new Set(
    firstFinances.map((f) => f.recurrenceMasterId).filter(Boolean) as string[],
  );

  for (const recurring of recurrings) {
    if (!hasLinkedFinance.has(recurring.id)) {
      mastersSkipped++;
      add(
        'warn',
        'recurrence',
        `Master sem lançamento vinculado: "${recurring.title}" (${recurring.id})`,
        { recurringId: recurring.id },
      );
      continue;
    }

    let rule: InstanceType<typeof RRule>;
    try {
      rule = RRule.fromString(recurring.recurrence!);
    } catch {
      add(
        'error',
        'recurrence',
        `RRULE inválida: "${recurring.title}" (${recurring.id}) — ${recurring.recurrence}`,
        { recurringId: recurring.id },
      );
      continue;
    }

    let expected: Date[];
    if (recurring.endDate) {
      expected = rule.between(recurring.date, recurring.endDate, true) as Date[];
    } else {
      expected = rule.all((_, len) => len < MAX_EAGER) as Date[];
    }

    const linked = byMaster.get(recurring.id) ?? { dates: [], ids: [] };

    // Duplicate dates
    const dateCounts = new Map<number, number>();
    for (const t of linked.dates) {
      dateCounts.set(t, (dateCounts.get(t) ?? 0) + 1);
    }
    for (const [t, count] of dateCounts) {
      if (count > 1) {
        add(
          'error',
          'recurrence',
          `Datas duplicadas no master "${recurring.title}": ${new Date(t).toISOString()} (${count}x)`,
          { recurringId: recurring.id },
        );
      }
    }

    const existingTimes = new Set(linked.dates);
    const missing = expected.filter((d) => !existingTimes.has(d.getTime()));

    if (missing.length > 0) {
      mastersWithGaps++;
      add(
        'error',
        'recurrence',
        `Master "${recurring.title}" (${recurring.id}): faltam ${missing.length}/${expected.length} ocorrência(s). Ex.: ${missing[0].toISOString()}`,
        { recurringId: recurring.id },
      );
    } else {
      mastersOk++;
    }

    // lastDate should match last expected occurrence
    if (expected.length > 0 && recurring.lastDate) {
      const lastExpected = expected[expected.length - 1];
      if (recurring.lastDate.getTime() !== lastExpected.getTime()) {
        add(
          'warn',
          'recurrence',
          `lastDate divergente em "${recurring.title}": esperado ${lastExpected.toISOString()}, atual ${recurring.lastDate.toISOString()}`,
          { recurringId: recurring.id },
        );
      }
    } else if (expected.length > 0 && !recurring.lastDate) {
      add(
        'warn',
        'recurrence',
        `lastDate ausente em "${recurring.title}" (${recurring.id})`,
        { recurringId: recurring.id },
      );
    }
  }

  return {
    totalMasters: recurrings.length,
    mastersOk,
    mastersWithGaps,
    mastersSkipped,
    totalLinkedFinances: allLinked.length,
  };
}

async function countMissingField(field: string): Promise<number> {
  const result = (await prisma.$runCommandRaw({
    aggregate: 'company_finance',
    pipeline: [
      { $match: { [field]: { $exists: false }, deleted: false } },
      { $count: 'total' },
    ],
    cursor: {},
  })) as { cursor?: { firstBatch?: { total: number }[] } };

  return result?.cursor?.firstBatch?.[0]?.total ?? 0;
}

async function validateFieldDefaults() {
  const missingInstallment = await countMissingField('isInstallment');
  if (missingInstallment > 0) {
    add(
      'warn',
      'schema',
      `${missingInstallment} lançamento(s) sem campo isInstallment — rode scripts/migrate-isInstallment.ts`,
    );
  }

  const missingPaidFromAdvance = await countMissingField('paidFromAdvance');
  if (missingPaidFromAdvance > 0) {
    add(
      'warn',
      'schema',
      `${missingPaidFromAdvance} lançamento(s) sem campo paidFromAdvance`,
    );
  }

  const missingAdvanceDeposit = await countMissingField('isAdvanceDeposit');
  if (missingAdvanceDeposit > 0) {
    add(
      'warn',
      'schema',
      `${missingAdvanceDeposit} lançamento(s) sem campo isAdvanceDeposit`,
    );
  }

  const totalFinances = await prisma.companyFinance.count({
    where: { deleted: false },
  });
  const recurringFinances = await prisma.companyFinance.count({
    where: { deleted: false, recurrenceMasterId: { not: null } },
  });
  const installmentFinances = await prisma.companyFinance.count({
    where: { deleted: false, isInstallment: true },
  });
  const paidFromAdvanceFinances = await prisma.companyFinance.count({
    where: { deleted: false, paidFromAdvance: true },
  });
  const advanceDeposits = await prisma.companyFinance.count({
    where: { deleted: false, isAdvanceDeposit: true },
  });

  return {
    totalFinances,
    recurringFinances,
    installmentFinances,
    paidFromAdvanceFinances,
    advanceDeposits,
    missingInstallment,
    missingPaidFromAdvance,
    missingAdvanceDeposit,
  };
}

async function validateAdvanceConsistency() {
  const advances = await prisma.companyFinanceAdvance.findMany({
    include: {
      applications: {
        where: { deleted: false, paidFromAdvance: true },
        select: { value: true, tax: true, retention: true, flow: true },
      },
    },
  });

  for (const adv of advances) {
    let appliedSum = 0;
    for (const app of adv.applications) {
      if (app.flow === 'IN') {
        appliedSum += app.value - app.tax - app.retention;
      } else {
        appliedSum += app.value + app.tax + app.retention;
      }
    }

    const expectedRemaining = adv.totalValue - appliedSum;
    if (adv.remainingValue !== expectedRemaining) {
      add(
        'error',
        'advance',
        `Adiantamento "${adv.title}" (${adv.id}): remainingValue=${adv.remainingValue}, esperado=${expectedRemaining}`,
      );
    }
  }

  return { totalAdvances: advances.length };
}

async function main() {
  console.log('Validando lançamentos financeiros...\n');

  const fieldStats = await validateFieldDefaults();
  console.log('--- Estatísticas gerais ---');
  console.log(`  Total lançamentos (ativos):     ${fieldStats.totalFinances}`);
  console.log(`  Vinculados a recorrência:       ${fieldStats.recurringFinances}`);
  console.log(`  Parcelas (duplicata):           ${fieldStats.installmentFinances}`);
  console.log(`  Pagos com adiantamento:         ${fieldStats.paidFromAdvanceFinances}`);
  console.log(`  Depósitos de adiantamento:      ${fieldStats.advanceDeposits}`);

  const recStats = await validateRecurrences();
  console.log('\n--- Recorrências ---');
  console.log(`  Masters com recorrência:        ${recStats.totalMasters}`);
  console.log(`  Masters completos:              ${recStats.mastersOk}`);
  console.log(`  Masters com lacunas:            ${recStats.mastersWithGaps}`);
  console.log(`  Masters sem lançamento base:    ${recStats.mastersSkipped}`);
  console.log(`  Lançamentos gerados (total):    ${recStats.totalLinkedFinances}`);

  const advStats = await validateAdvanceConsistency();
  console.log('\n--- Adiantamentos ---');
  console.log(`  Total adiantamentos:            ${advStats.totalAdvances}`);

  const errors = issues.filter((i) => i.severity === 'error');
  const warns = issues.filter((i) => i.severity === 'warn');

  if (issues.length === 0) {
    console.log('\n✅ Nenhum problema encontrado.');
  } else {
    console.log(`\n⚠️  ${errors.length} erro(s), ${warns.length} aviso(s):\n`);
    for (const issue of issues.slice(0, 50)) {
      const prefix = issue.severity === 'error' ? '❌' : '⚠️ ';
      console.log(`  ${prefix} [${issue.category}] ${issue.message}`);
    }
    if (issues.length > 50) {
      console.log(`  ... e mais ${issues.length - 50} item(ns)`);
    }
  }

  console.log('\n--- Resultado ---');
  if (errors.length === 0) {
    console.log('VALIDAÇÃO OK — nenhum erro crítico.');
  } else {
    console.log('VALIDAÇÃO COM ERROS — verifique os itens acima.');
    process.exit(1);
  }
}

main()
  .catch((err) => {
    console.error('Validação falhou:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
