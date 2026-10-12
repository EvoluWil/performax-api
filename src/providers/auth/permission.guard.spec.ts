import * as assert from 'node:assert/strict';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PermissionEnum,
  PermissionScopeEnum,
  UserRoleEnum,
} from '@prisma/client';
import { COMPANY_MEMBER_KEY } from 'src/decorators/company-member.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { REQUIRE_PERMISSION_KEY } from 'src/decorators/require-permission.decorator';
import { PermissionGuard } from './permission.guard';
import { CompanyPermissionService } from '../permission/company-permission.service';

type Meta = Record<string, unknown>;

function reflectorFor(meta: Meta) {
  return {
    getAllAndOverride: (key: string) => meta[key],
  } as unknown as Reflector;
}

function httpContext(request: {
  user?: { id: string };
  params?: { companyId?: string };
}): ExecutionContext {
  return {
    getHandler: () => 'handler',
    getClass: () => 'class',
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

function memberRole(permission: PermissionEnum = PermissionEnum.READ) {
  return {
    id: 'link',
    targetIds: [],
    role: {
      isAdmin: false,
      permissions: [
        {
          permission,
          scope: PermissionScopeEnum.SELF,
          module: { code: 'task' },
        },
      ],
    },
  };
}

function prismaStub(options?: {
  ownerId?: string;
  role?: ReturnType<typeof memberRole> | null;
  moduleId?: string | null;
  companyModuleId?: string | null;
  userRole?: UserRoleEnum;
}) {
  const {
    ownerId = 'owner',
    role = null,
    moduleId = 'mod',
    companyModuleId = 'enabled',
    userRole = UserRoleEnum.USER,
  } = options ?? {};

  return {
    user: { findUnique: async () => ({ role: userRole }) },
    company: { findUnique: async () => ({ ownerId }) },
    companyUserRole: { findUnique: async () => role },
    module: { findFirst: async () => (moduleId ? { id: moduleId } : null) },
    companyModule: {
      findFirst: async () => (companyModuleId ? { id: companyModuleId } : null),
    },
  };
}

function guardFor(meta: Meta, prisma: ReturnType<typeof prismaStub>) {
  const service = new CompanyPermissionService(prisma as never);
  return new PermissionGuard(reflectorFor(meta), service);
}

async function expectForbidden(run: () => Promise<boolean>) {
  await assert.rejects(run, (error: unknown) => {
    assert.ok(error instanceof ForbiddenException);
    assert.equal(error.getStatus(), 403);
    return true;
  });
}

async function main() {
  const request = {
    user: { id: 'user' },
    params: { companyId: 'company' },
  };

  const open = await guardFor({}, prismaStub()).canActivate(
    httpContext(request),
  );
  assert.equal(open, true);

  const publicRoute = await guardFor(
    {
      [IS_PUBLIC_KEY]: true,
      [REQUIRE_PERMISSION_KEY]: { module: 'task', level: 'ADMIN' },
    },
    prismaStub({ moduleId: null }),
  ).canActivate(httpContext(request));
  assert.equal(publicRoute, true);

  await expectForbidden(() =>
    guardFor(
      { [REQUIRE_PERMISSION_KEY]: { module: 'task', level: 'READ' } },
      prismaStub({ companyModuleId: null }),
    ).canActivate(httpContext(request)),
  );

  await expectForbidden(() =>
    guardFor(
      { [REQUIRE_PERMISSION_KEY]: { module: 'task', level: 'WRITE' } },
      prismaStub({ role: memberRole(PermissionEnum.READ) }),
    ).canActivate(httpContext(request)),
  );

  await expectForbidden(() =>
    guardFor(
      { [COMPANY_MEMBER_KEY]: true },
      prismaStub({ role: null }),
    ).canActivate(httpContext(request)),
  );

  const admin = await guardFor(
    { [REQUIRE_PERMISSION_KEY]: { module: 'task', level: 'ADMIN' } },
    prismaStub({ ownerId: 'user' }),
  ).canActivate(httpContext(request));
  assert.equal(admin, true);

  const member = await guardFor(
    { [COMPANY_MEMBER_KEY]: true },
    prismaStub({ role: memberRole() }),
  ).canActivate(httpContext(request));
  assert.equal(member, true);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
