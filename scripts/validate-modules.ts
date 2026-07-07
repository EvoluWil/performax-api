/**
 * Validate module catalog and permission integrity.
 *
 *   npx ts-node -r tsconfig-paths/register scripts/validate-modules.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {
  MODULE_CODES,
  MODULE_DEFINITIONS,
} from '../src/constants/modules';

const prisma = new PrismaClient();

async function main() {
  let hasErrors = false;

  const dbModules = await prisma.module.findMany({
    where: { deleted: false },
    orderBy: { code: 'asc' },
  });

  const dbCodes = new Set(dbModules.map((m) => m.code.toLowerCase()));
  const expectedCodes = new Set(
    MODULE_CODES.map((code) => code.toLowerCase()),
  );

  const missingInDb = MODULE_CODES.filter(
    (code) => !dbCodes.has(code.toLowerCase()),
  );
  const extraInDb = dbModules.filter(
    (m) => !expectedCodes.has(m.code.toLowerCase()),
  );

  if (missingInDb.length) {
    hasErrors = true;
    console.error('Missing modules in database:', missingInDb.join(', '));
  }

  if (extraInDb.length) {
    console.warn(
      'Extra modules in database (not in MODULE_DEFINITIONS):',
      extraInDb.map((m) => m.code).join(', '),
    );
  }

  for (const definition of MODULE_DEFINITIONS) {
    const dbModule = dbModules.find(
      (m) => m.code.toLowerCase() === definition.code.toLowerCase(),
    );
    if (!dbModule) continue;

    if (
      dbModule.name !== definition.name ||
      dbModule.description !== definition.description
    ) {
      console.warn(
        `Module "${definition.code}" metadata differs from constants (name/description).`,
      );
    }
  }

  const permissions = await prisma.companyRolePermission.findMany({
    include: { module: true, companyRole: true },
  });

  const orphanPermissions = permissions.filter((p) => !p.module || p.module.deleted);

  if (orphanPermissions.length) {
    hasErrors = true;
    console.error(
      `Found ${orphanPermissions.length} orphan permission(s) referencing missing/deleted modules.`,
    );
    for (const perm of orphanPermissions.slice(0, 10)) {
      console.error(
        `  role="${perm.companyRole?.name ?? perm.companyRoleId}" moduleId=${perm.moduleId}`,
      );
    }
  }

  if (hasErrors) {
    console.error('Module validation failed.');
    process.exit(1);
  }

  console.log(
    `Module validation passed. ${dbModules.length} module(s) in database, ${permissions.length} permission(s) checked.`,
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
