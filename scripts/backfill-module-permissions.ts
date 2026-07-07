/**
 * Backfill permissions and company modules for register, contract and employee.
 *
 * Run after seed-modules:
 *
 *   npx ts-node -r tsconfig-paths/register scripts/backfill-module-permissions.ts
 *
 * Optional dry run:
 *
 *   DRY_RUN=1 npx ts-node -r tsconfig-paths/register scripts/backfill-module-permissions.ts
 */

import 'dotenv/config';
import { PermissionEnum, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dryRun = process.env.DRY_RUN === '1';

type ModuleRecord = { id: string; code: string };

async function loadModulesByCode(): Promise<Map<string, ModuleRecord>> {
  const modules = await prisma.module.findMany({
    where: { deleted: false },
    select: { id: true, code: true },
  });

  return new Map(modules.map((m) => [m.code.toLowerCase(), m]));
}

async function ensureCompanyModule(
  companyId: string,
  moduleId: string,
  stats: { companyModules: number },
) {
  const existing = await prisma.companyModule.findFirst({
    where: { companyId, moduleId },
  });

  if (existing) return;

  if (dryRun) {
    stats.companyModules++;
    return;
  }

  await prisma.companyModule.create({
    data: { companyId, moduleId },
  });
  stats.companyModules++;
}

async function copyPermissionIfMissing(
  roleId: string,
  targetModuleId: string,
  permission: PermissionEnum,
  scope: string,
  stats: { permissions: number },
) {
  const existing = await prisma.companyRolePermission.findFirst({
    where: { companyRoleId: roleId, moduleId: targetModuleId },
  });

  if (existing) return;

  if (dryRun) {
    stats.permissions++;
    return;
  }

  await prisma.companyRolePermission.create({
    data: {
      companyRoleId: roleId,
      moduleId: targetModuleId,
      permission,
      scope: scope as 'SELF' | 'TEAM' | 'ALL',
    },
  });
  stats.permissions++;
}

async function main() {
  const modulesByCode = await loadModulesByCode();

  const register = modulesByCode.get('register');
  const contract = modulesByCode.get('contract');
  const employee = modulesByCode.get('employee');
  const client = modulesByCode.get('client');
  const task = modulesByCode.get('task');
  const budget = modulesByCode.get('budget');
  const occurrence = modulesByCode.get('occurrence');

  const missing = ['register', 'contract', 'employee'].filter(
    (code) => !modulesByCode.has(code),
  );

  if (missing.length) {
    throw new Error(
      `Missing modules in database: ${missing.join(', ')}. Run seed:modules first.`,
    );
  }

  const stats = { permissions: 0, companyModules: 0 };

  const operationalSourceIds = [task?.id, budget?.id, occurrence?.id].filter(
    Boolean,
  ) as string[];

  const roles = await prisma.companyRole.findMany({
    include: {
      permissions: { include: { module: true } },
      company: { include: { modules: { include: { module: true } } } },
    },
  });

  for (const role of roles) {
    for (const perm of role.permissions) {
      const sourceCode = perm.module?.code?.toLowerCase();
      if (!sourceCode) continue;

      if (
        register &&
        operationalSourceIds.includes(perm.moduleId) &&
        (perm.permission === PermissionEnum.WRITE ||
          perm.permission === PermissionEnum.ADMIN)
      ) {
        await copyPermissionIfMissing(
          role.id,
          register.id,
          perm.permission,
          perm.scope,
          stats,
        );
      }

      if (client && sourceCode === 'client' && contract) {
        await copyPermissionIfMissing(
          role.id,
          contract.id,
          perm.permission,
          perm.scope,
          stats,
        );
      }

      if (client && sourceCode === 'client' && employee) {
        await copyPermissionIfMissing(
          role.id,
          employee.id,
          perm.permission,
          perm.scope,
          stats,
        );
      }
    }

    const enabledCodes = new Set(
      role.company.modules
        .map((cm) => cm.module?.code?.toLowerCase())
        .filter(Boolean) as string[],
    );

    const companyId = role.companyId;

    if (
      register &&
      (enabledCodes.has('task') ||
        enabledCodes.has('budget') ||
        enabledCodes.has('occurrence'))
    ) {
      await ensureCompanyModule(companyId, register.id, stats);
    }

    if (contract && enabledCodes.has('client')) {
      await ensureCompanyModule(companyId, contract.id, stats);
    }

    if (employee && enabledCodes.has('client')) {
      await ensureCompanyModule(companyId, employee.id, stats);
    }
  }

  console.log(
    `${dryRun ? 'Would add' : 'Added'} ${stats.permissions} permission(s) and ${stats.companyModules} company module(s).`,
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
