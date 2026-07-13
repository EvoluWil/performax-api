/**
 * Backfill recurrences — standalone script
 *
 * Eagerly generates all missing finance occurrences for every
 * CompanyFinanceRecurring record in the database, following the same rules
 * as the new eager-generation strategy:
 *   - If the master has an endDate  → generate all occurrences up to that date
 *   - If no endDate                 → generate the first 100 occurrences
 *
 * Idempotent: existing (recurrenceMasterId, date) pairs are never duplicated.
 *
 * Prerequisites (Prisma + MongoDB):
 *   - DATABASE_URL must be a direct MongoDB URL (mongodb:// or mongodb+srv://)
 *   - Regenerate the client with the standard command (never --no-engine):
 *       npx prisma generate
 *
 * Run once after deploying the eager-generation feature:
 *
 *   npx ts-node -r tsconfig-paths/register scripts/backfill-recurrences.ts
 *
 * Optional: target a single company
 *
 *   COMPANY_ID=<id> npx ts-node -r tsconfig-paths/register scripts/backfill-recurrences.ts
 */

import 'dotenv/config';
import { PrismaClient, FinanceStatusEnum } from '@prisma/client';

const MAX_EAGER = 100;
const prisma = new PrismaClient();
const targetCompanyId = process.env.COMPANY_ID ?? undefined;

async function generateProtocol(): Promise<string> {
  const now = new Date();
  const base =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');

  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = attempt === 0 ? '' : `-${Math.random().toString(36).slice(2, 6)}`;
    const protocol = `${base}${suffix}`;
    const exists = await prisma.companyFinance.findUnique({
      where: { protocol },
      select: { id: true },
    });
    if (!exists) return protocol;
  }
  return `${base}-${Date.now()}`;
}

async function main() {
  const { RRule } = await import('rrule');

  const where: any = { recurrence: { not: null } };
  if (targetCompanyId) where.companyId = targetCompanyId;

  const recurrings = await prisma.companyFinanceRecurring.findMany({ where });
  console.log(`Found ${recurrings.length} recurring master(s) to process.`);

  // Resolve createdById / responsibleId from the first linked finance
  const masterIds = recurrings.map((r) => r.id);
  const firstFinances = await prisma.companyFinance.findMany({
    where: { recurrenceMasterId: { in: masterIds } },
    select: {
      recurrenceMasterId: true,
      createdById: true,
      responsibleId: true,
    },
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

  for (const recurring of recurrings) {
    const createdById = createdByMap.get(recurring.id);
    if (!createdById) {
      console.warn(
        `  [SKIP] Recurring ${recurring.id} (${recurring.title}) — no linked finance found`,
      );
      continue;
    }

    let rule: InstanceType<typeof RRule>;
    try {
      rule = RRule.fromString(recurring.recurrence!);
    } catch {
      console.warn(
        `  [SKIP] Recurring ${recurring.id} — invalid RRULE: ${recurring.recurrence}`,
      );
      continue;
    }

    let occurrences: Date[];
    if (recurring.endDate) {
      occurrences = rule.between(recurring.date, recurring.endDate, true) as Date[];
    } else {
      occurrences = rule.all((_, len) => len < MAX_EAGER) as Date[];
    }

    if (occurrences.length === 0) {
      console.log(`  [OK]   Recurring ${recurring.id} (${recurring.title}) — no occurrences to generate`);
      continue;
    }

    // Check existing
    const existing = await prisma.companyFinance.findMany({
      where: {
        recurrenceMasterId: recurring.id,
        date: { in: occurrences },
        deleted: false,
      },
      select: { date: true },
    });
    const existingTimes = new Set(existing.map((e) => e.date.getTime()));
    const toCreate = occurrences.filter((d) => !existingTimes.has(d.getTime()));

    if (toCreate.length === 0) {
      console.log(
        `  [OK]   Recurring ${recurring.id} (${recurring.title}) — all ${occurrences.length} occurrence(s) already exist`,
      );
      continue;
    }

    const responsibleId = responsibleMap.get(recurring.id) ?? null;
    let created = 0;

    for (const dueDate of toCreate) {
      const protocol = await generateProtocol();
      try {
        await prisma.companyFinance.create({
          data: {
            protocol,
            title: recurring.title,
            description: recurring.description ?? undefined,
            value: recurring.value,
            date: dueDate,
            flow: recurring.flow,
            observation: recurring.observation ?? undefined,
            status: FinanceStatusEnum.PENDING,
            approved: true,
            recurrenceMasterId: recurring.id,
            createdBy: { connect: { id: createdById } },
            company: { connect: { id: recurring.companyId } },
            ...(responsibleId && {
              responsible: { connect: { id: responsibleId } },
            }),
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
            ...(recurring.segmentId && {
              segment: { connect: { id: recurring.segmentId } },
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
        });
        created++;
      } catch (err: any) {
        console.error(
          `  [ERR]  Failed to create occurrence for recurring ${recurring.id} on ${dueDate.toISOString()}: ${err.message}`,
        );
      }
    }

    // Update high-water mark
    const lastOcc = occurrences[occurrences.length - 1];
    await prisma.companyFinanceRecurring.update({
      where: { id: recurring.id },
      data: { lastDate: lastOcc },
    });

    totalCreated += created;
    console.log(
      `  [OK]   Recurring ${recurring.id} (${recurring.title}) — created ${created}/${toCreate.length} new occurrence(s) (${existing.length} already existed)`,
    );
  }

  console.log(`\nDone. Total new occurrences created: ${totalCreated}`);
}

main()
  .catch((err) => {
    console.error('Script failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
