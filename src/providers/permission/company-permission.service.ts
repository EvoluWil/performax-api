import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PermissionEnum,
  PermissionScopeEnum,
  UserRoleEnum,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type PermissionLevel = 'FILTER' | 'READ' | 'WRITE' | 'ADMIN';

const PERMISSION_RANK: Record<PermissionEnum, number> = {
  FILTER: 1,
  READ: 2,
  WRITE: 3,
  ADMIN: 4,
};

const SCOPE_RANK: Record<PermissionScopeEnum, number> = {
  SELF: 0,
  TEAM: 1,
  ALL: 2,
};

export type ResolvedPermission = {
  moduleCode: string;
  permission: PermissionEnum;
  scope: PermissionScopeEnum;
};

export type CompanyPermissionContext = {
  userId: string;
  companyId: string;
  isAdmin: boolean;
  permissions: ResolvedPermission[];
  targetIds: string[];
};

@Injectable()
export class CompanyPermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveContext(
    userId: string,
    companyId: string,
  ): Promise<CompanyPermissionContext> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role === UserRoleEnum.SYSTEM_ADMIN) {
      return {
        userId,
        companyId,
        isAdmin: true,
        permissions: [],
        targetIds: [],
      };
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { ownerId: true },
    });

    if (company?.ownerId === userId) {
      return {
        userId,
        companyId,
        isAdmin: true,
        permissions: [],
        targetIds: [],
      };
    }

    const companyUser = await this.prisma.companyUserRole.findUnique({
      where: { userId_companyId: { userId, companyId } },
      include: {
        role: {
          include: {
            permissions: {
              include: { module: { select: { code: true } } },
            },
          },
        },
      },
    });

    if (companyUser?.role?.isAdmin) {
      return {
        userId,
        companyId,
        isAdmin: true,
        permissions: [],
        targetIds: [],
      };
    }

    const permissions: ResolvedPermission[] =
      companyUser?.role?.permissions?.map((item) => ({
        moduleCode: item.module.code.toLowerCase(),
        permission: item.permission,
        scope: item.scope,
      })) ?? [];

    return {
      userId,
      companyId,
      isAdmin: false,
      permissions,
      targetIds: companyUser?.targetIds ?? [],
    };
  }

  hasLevel(ctx: CompanyPermissionContext, moduleCode: string, min: PermissionLevel) {
    if (ctx.isAdmin) return true;

    const normalized = moduleCode.trim().toLowerCase();
    const required = PERMISSION_RANK[min];

    return ctx.permissions.some(
      (item) =>
        item.moduleCode === normalized &&
        PERMISSION_RANK[item.permission] >= required,
    );
  }

  hasFilterAccess(ctx: CompanyPermissionContext, moduleCode: string) {
    return this.hasLevel(ctx, moduleCode, 'FILTER');
  }

  hasPageAccess(ctx: CompanyPermissionContext, moduleCode: string) {
    return this.hasLevel(ctx, moduleCode, 'READ');
  }

  getModuleScope(
    ctx: CompanyPermissionContext,
    moduleCode: string,
  ): PermissionScopeEnum | null {
    if (ctx.isAdmin) return PermissionScopeEnum.ALL;

    const normalized = moduleCode.trim().toLowerCase();
    const matched = ctx.permissions.filter(
      (item) =>
        item.moduleCode === normalized &&
        PERMISSION_RANK[item.permission] >= PERMISSION_RANK.FILTER,
    );

    if (!matched.length) return null;

    return matched.reduce((current, item) => {
      if (!current) return item.scope;
      return SCOPE_RANK[item.scope] > SCOPE_RANK[current] ? item.scope : current;
    }, matched[0].scope);
  }

  getScopedUserIds(
    ctx: CompanyPermissionContext,
    moduleCode: string,
  ): string[] | null {
    const scope = this.getModuleScope(ctx, moduleCode);
    if (!scope) return [];
    if (scope === PermissionScopeEnum.ALL) return null;

    const ids = new Set<string>([ctx.userId]);

    if (scope === PermissionScopeEnum.TEAM) {
      ctx.targetIds.forEach((id) => {
        if (id && id !== ctx.userId) ids.add(id);
      });
    }

    return Array.from(ids);
  }

  assertFilterAccess(ctx: CompanyPermissionContext, moduleCode: string) {
    if (!this.hasFilterAccess(ctx, moduleCode)) {
      throw new ForbiddenException(
        `Sem permissão de filtro para o módulo ${moduleCode}`,
      );
    }
  }

  assertPageAccess(ctx: CompanyPermissionContext, moduleCode: string) {
    if (!this.hasPageAccess(ctx, moduleCode)) {
      throw new ForbiddenException(
        `Sem permissão de leitura para o módulo ${moduleCode}`,
      );
    }
  }

  private async getScopedCompanyUserRoleIds(
    ctx: CompanyPermissionContext,
    moduleCode: string,
  ): Promise<string[] | null> {
    const scopedUserIds = this.getScopedUserIds(ctx, moduleCode);
    if (scopedUserIds === null) return null;

    const roles = await this.prisma.companyUserRole.findMany({
      where: {
        companyId: ctx.companyId,
        userId: { in: scopedUserIds },
      },
      select: { id: true },
    });

    return roles.map((role) => role.id);
  }

  async applyClientScopeToWhere(
    where: Record<string, unknown>,
    ctx: CompanyPermissionContext,
    moduleCode = 'client',
  ) {
    if (ctx.isAdmin) return;

    const scopedRoleIds = await this.getScopedCompanyUserRoleIds(
      ctx,
      moduleCode,
    );
    if (scopedRoleIds === null) return;

    where.AND = [
      ...((where.AND as unknown[]) ?? []),
      {
        OR: [
          { userIds: { hasSome: scopedRoleIds } },
          { createdById: { in: this.getScopedUserIds(ctx, moduleCode) ?? [] } },
        ],
      },
    ];
  }

  applyUserIdsScopeToWhere(
    where: Record<string, unknown>,
    ctx: CompanyPermissionContext,
    moduleCode: string,
    field = 'id',
  ) {
    if (ctx.isAdmin) return;

    const scopedUserIds = this.getScopedUserIds(ctx, moduleCode);
    if (scopedUserIds === null) return;

    where[field] = { in: scopedUserIds };
  }

  applyResponsibleScopeToWhere(
    where: Record<string, unknown>,
    ctx: CompanyPermissionContext,
    moduleCode: string,
  ) {
    if (ctx.isAdmin) return;

    const scopedUserIds = this.getScopedUserIds(ctx, moduleCode);
    if (scopedUserIds === null) return;

    where.responsibleId = { in: scopedUserIds };
  }

  async assertClientInScope(
    ctx: CompanyPermissionContext,
    clientId: string,
  ) {
    if (ctx.isAdmin) return;

    this.assertFilterAccess(ctx, 'client');

    const client = await this.prisma.companyClient.findFirst({
      where: { id: clientId, companyId: ctx.companyId, deleted: false },
      select: { id: true, userIds: true, createdById: true },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const scope = this.getModuleScope(ctx, 'client');
    if (scope === PermissionScopeEnum.ALL) return;

    const scopedUserIds = this.getScopedUserIds(ctx, 'client') ?? [];
    const scopedRoleIds = await this.getScopedCompanyUserRoleIds(ctx, 'client');

    const allowedByRole = scopedRoleIds
      ? client.userIds.some((id) => scopedRoleIds.includes(id))
      : false;
    const allowedByCreator =
      client.createdById != null && scopedUserIds.includes(client.createdById);

    if (!allowedByRole && !allowedByCreator) {
      throw new ForbiddenException('Cliente fora do escopo permitido');
    }
  }

  async assertUserInScope(
    ctx: CompanyPermissionContext,
    userId: string,
    moduleCode = 'user',
  ) {
    if (ctx.isAdmin) return;

    this.assertFilterAccess(ctx, moduleCode);

    const scopedUserIds = this.getScopedUserIds(ctx, moduleCode);
    if (scopedUserIds === null) return;

    if (!scopedUserIds.includes(userId)) {
      throw new ForbiddenException('Usuário fora do escopo permitido');
    }
  }

  async validateOperationalListWhere(
    ctx: CompanyPermissionContext,
    moduleCode: string,
    where: Record<string, unknown>,
  ) {
    for (const clientId of this.collectScalars(where, 'clientId')) {
      await this.assertClientInScope(ctx, clientId);
    }

    for (const responsibleId of this.collectScalars(where, 'responsibleId')) {
      await this.assertUserInScope(ctx, responsibleId, 'user');
    }

    for (const createdById of this.collectScalars(where, 'createdById')) {
      await this.assertUserInScope(ctx, createdById, 'user');
    }

    if (moduleCode === 'task' || moduleCode === 'budget') {
      this.applyResponsibleScopeToWhere(where, ctx, moduleCode);
    }

    if (moduleCode === 'occurrence') {
      if (ctx.isAdmin) return;
      const scopedUserIds = this.getScopedUserIds(ctx, moduleCode);
      if (scopedUserIds === null) return;
      where.createdById = this.mergeInFilter(where.createdById, scopedUserIds);
    }
  }

  private collectScalars(
    where: Record<string, unknown>,
    field: string,
    visited = new Set<unknown>(),
  ): string[] {
    if (visited.has(where)) return [];
    visited.add(where);

    const values = new Set<string>();
    const direct = this.extractScalar(where[field]);
    if (direct) values.add(direct);

    for (const key of ['AND', 'OR'] as const) {
      const group = where[key];
      if (!Array.isArray(group)) continue;

      for (const item of group) {
        if (!item || typeof item !== 'object') continue;
        for (const value of this.collectScalars(
          item as Record<string, unknown>,
          field,
          visited,
        )) {
          values.add(value);
        }
      }
    }

    return Array.from(values);
  }

  private extractScalar(value: unknown): string | null {
    if (value == null) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null && 'in' in value) {
      return null;
    }
    return String(value);
  }

  private mergeInFilter(
    existing: unknown,
    allowedIds: string[],
  ): { in: string[] } {
    const existingScalar = this.extractScalar(existing);
    if (existingScalar) {
      return { in: allowedIds.includes(existingScalar) ? [existingScalar] : [] };
    }
    return { in: allowedIds };
  }
}
