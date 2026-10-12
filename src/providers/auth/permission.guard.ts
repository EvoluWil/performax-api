import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { COMPANY_MEMBER_KEY } from 'src/decorators/company-member.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import {
  REQUIRE_PERMISSION_KEY,
  RequiredPermission,
} from 'src/decorators/require-permission.decorator';
import { CompanyPermissionService } from '../permission/company-permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: CompanyPermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const required = this.reflector.getAllAndOverride<RequiredPermission>(
      REQUIRE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    const memberOnly = this.reflector.getAllAndOverride<boolean>(
      COMPANY_MEMBER_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required && !memberOnly) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { id?: string } | undefined;
    const userId = user?.id;
    const companyId = request.params?.companyId;

    if (!userId) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (!companyId || Array.isArray(companyId)) {
      throw new ForbiddenException('Empresa não identificada');
    }

    if (memberOnly) {
      await this.permissionService.assertCompanyMember(userId, companyId);
    }

    if (required) {
      await this.permissionService.assertCompanyHasModule(
        companyId,
        required.module,
      );
      const ctx = await this.permissionService.resolveContext(
        userId,
        companyId,
      );
      this.permissionService.assertLevel(ctx, required.module, required.level);
    }

    return true;
  }
}
