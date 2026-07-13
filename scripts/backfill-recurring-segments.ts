/**
 * Backfill segmentId on recurring masters and their generated finances.
 *
 * Strategy:
 *   1. For each CompanyFinanceRecurring without segmentId, copy from the
 *      earliest linked CompanyFinance that has segmentId (the "parent" entry).
 *   2. For each CompanyFinance with recurrenceMasterId but no segmentId,
 *      copy from its recurring master (after step 1) or from the earliest
 *      sibling finance with segmentId.
 *
 * Run once after deploying the recurring segmentId fix:
 *
 *   npx ts-node -r tsconfig-paths/register scripts/backfill-recurring-segments.ts
 *
 * Optional dry run:
 *
 *   DRY_RUN=1 npx ts-node -r tsconfig-paths/register scripts/backfill-recurring-segments.ts
 *
 * Optional: target a single company
 *
 *   COMPANY_ID=<id> npx ts-node -r tsconfig-paths/register scripts/backfill-recurring-segments.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const targetCompanyId = process.env.COMPANY_ID ?? undefined;
const dryRun = process.env.DRY_RUN === '1';

const missingSegmentFilter = {
  OR: [{ segmentId: null }, { segmentId: { isSet: false } }],
};

async function main() {
  const recurringWhere: { companyId?: string } = {};
  if (targetCompanyId) recurringWhere.companyId = targetCompanyId;

  const allRecurrings = await prisma.companyFinanceRecurring.findMany({
    where: recurringWhere,
    select: { id: true, title: true, segmentId: true },
  });

  const mastersWithoutSegment = allRecurrings.filter((r) => !r.segmentId);

  console.log(
    `Found ${allRecurrings.length} recurring master(s), ${mastersWithoutSegment.length} without segmentId.`,
  );

  const masterIds = allRecurrings.map((r) => r.id);

  const financesWithSegment = await prisma.companyFinance.findMany({
    where: {
      recurrenceMasterId: { in: masterIds },
      segmentId: { not: null, isSet: true },
      deleted: false,
    },
    select: { recurrenceMasterId: true, segmentId: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const segmentByMaster = new Map<string, string>();
  for (const f of financesWithSegment) {
    if (!f.recurrenceMasterId || !f.segmentId) continue;
    if (!segmentByMaster.has(f.recurrenceMasterId)) {
      segmentByMaster.set(f.recurrenceMasterId, f.segmentId);
    }
  }

  let mastersUpdated = 0;
  for (const recurring of mastersWithoutSegment) {
    const segmentId = segmentByMaster.get(recurring.id);
    if (!segmentId) continue;

    if (dryRun) {
      console.log(
        `[dry-run] Master ${recurring.id} (${recurring.title}) -> segmentId ${segmentId}`,
      );
    } else {
      await prisma.companyFinanceRecurring.update({
        where: { id: recurring.id },
        data: { segmentId },
      });
    }
    mastersUpdated++;
  }

  console.log(
    `${dryRun ? 'Would update' : 'Updated'} ${mastersUpdated} recurring master(s) with segmentId.`,
  );

  const financeWhere: {
    recurrenceMasterId: { not: null };
    deleted: boolean;
    companyId?: string;
  } = {
    recurrenceMasterId: { not: null },
    deleted: false,
  };
  if (targetCompanyId) financeWhere.companyId = targetCompanyId;

  const orphanFinances = await prisma.companyFinance.findMany({
    where: {
      ...financeWhere,
      ...missingSegmentFilter,
    },
    select: { id: true, recurrenceMasterId: true },
  });

  console.log(
    `Found ${orphanFinances.length} recurring finance(s) without segmentId.`,
  );

  const masterSegmentMap = new Map<string, string>();
  for (const m of allRecurrings) {
    if (m.segmentId) masterSegmentMap.set(m.id, m.segmentId);
  }
  if (!dryRun) {
    const refreshedMasters = await prisma.companyFinanceRecurring.findMany({
      where: { id: { in: masterIds } },
      select: { id: true, segmentId: true },
    });
    for (const m of refreshedMasters) {
      if (m.segmentId) masterSegmentMap.set(m.id, m.segmentId);
    }
  } else {
    for (const recurring of mastersWithoutSegment) {
      const segmentId = segmentByMaster.get(recurring.id);
      if (segmentId) masterSegmentMap.set(recurring.id, segmentId);
    }
  }

  const financeIdsByMaster = new Map<string, string[]>();
  let skippedFinances = 0;

  for (const finance of orphanFinances) {
    const masterId = finance.recurrenceMasterId!;
    const segmentId =
      masterSegmentMap.get(masterId) ?? segmentByMaster.get(masterId);
    if (!segmentId) {
      skippedFinances++;
      continue;
    }

    const ids = financeIdsByMaster.get(masterId) ?? [];
    ids.push(finance.id);
    financeIdsByMaster.set(masterId, ids);
  }

  let financesUpdated = 0;
  for (const [masterId, ids] of financeIdsByMaster) {
    const segmentId =
      masterSegmentMap.get(masterId) ?? segmentByMaster.get(masterId);
    if (!segmentId) continue;

    if (dryRun) {
      financesUpdated += ids.length;
      continue;
    }

    const chunkSize = 200;
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      let attempt = 0;
      while (attempt < 5) {
        try {
          const result = await prisma.companyFinance.updateMany({
            where: { id: { in: chunk } },
            data: { segmentId },
          });
          financesUpdated += result.count;
          break;
        } catch (err: any) {
          attempt++;
          if (attempt >= 5) throw err;
          await new Promise((r) => setTimeout(r, 500 * attempt));
        }
      }
    }
  }

  console.log(
    `${dryRun ? 'Would update' : 'Updated'} ${financesUpdated} recurring finance(s) with segmentId.`,
  );
  if (skippedFinances > 0) {
    console.log(
      `Skipped ${skippedFinances} finance(s) — no segmentId found on parent or siblings.`,
    );
  }
  console.log('\nDone.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
