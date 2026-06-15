/**
 * Backfill budget monetary values to cents.
 *
 * Before this change, budget values were stored as truncated reais (Int).
 * After the fix, values are stored in centavos (same as finance module).
 *
 * Run once after deploying the budget cents fix:
 *
 *   npx ts-node -r tsconfig-paths/register scripts/backfill-budget-cents.ts
 *
 * Optional dry run:
 *
 *   DRY_RUN=1 npx ts-node -r tsconfig-paths/register scripts/backfill-budget-cents.ts
 *
 * Optional: target a single company
 *
 *   COMPANY_ID=<id> npx ts-node -r tsconfig-paths/register scripts/backfill-budget-cents.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const targetCompanyId = process.env.COMPANY_ID ?? undefined;
const dryRun = process.env.DRY_RUN === '1';

async function main() {
  const where: { companyId?: string } = {};
  if (targetCompanyId) where.companyId = targetCompanyId;

  const budgets = await prisma.companyBudget.findMany({ where });
  let updated = 0;

  for (const budget of budgets) {
    const items = (budget.items ?? []).map((item) => ({
      ...item,
      value: item.value * 100,
    }));

    const nextValue = budget.value * 100;

    if (dryRun) {
      console.log(
        `[dry-run] ${budget.id} value ${budget.value} -> ${nextValue}, items ${budget.items?.length ?? 0}`,
      );
      updated++;
      continue;
    }

    await prisma.companyBudget.update({
      where: { id: budget.id },
      data: { value: nextValue, items },
    });
    updated++;
  }

  console.log(
    `${dryRun ? 'Would update' : 'Updated'} ${updated} budget(s) to centavos.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
