/**
 * Upsert canonical module catalog into MongoDB.
 *
 *   npx ts-node -r tsconfig-paths/register scripts/seed-modules.ts
 *
 * Optional dry run:
 *
 *   DRY_RUN=1 npx ts-node -r tsconfig-paths/register scripts/seed-modules.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { MODULE_DEFINITIONS } from '../src/constants/modules';

const prisma = new PrismaClient();
const dryRun = process.env.DRY_RUN === '1';

async function main() {
  let created = 0;
  let updated = 0;

  for (const definition of MODULE_DEFINITIONS) {
    const existing = await prisma.module.findUnique({
      where: { code: definition.code },
    });

    if (!existing) {
      if (dryRun) {
        console.log(`[dry-run] would create module "${definition.code}"`);
        created++;
        continue;
      }

      await prisma.module.create({
        data: {
          code: definition.code,
          name: definition.name,
          description: definition.description,
        },
      });
      console.log(`Created module "${definition.code}"`);
      created++;
      continue;
    }

    const needsUpdate =
      existing.name !== definition.name ||
      existing.description !== definition.description ||
      existing.deleted;

    if (!needsUpdate) {
      console.log(`Module "${definition.code}" already up to date`);
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] would update module "${definition.code}"`);
      updated++;
      continue;
    }

    await prisma.module.update({
      where: { id: existing.id },
      data: {
        name: definition.name,
        description: definition.description,
        deleted: false,
      },
    });
    console.log(`Updated module "${definition.code}"`);
    updated++;
  }

  console.log(
    `${dryRun ? 'Would create' : 'Created'} ${created}, ${dryRun ? 'would update' : 'updated'} ${updated} module(s).`,
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
