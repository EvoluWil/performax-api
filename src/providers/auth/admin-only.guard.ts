import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '@prisma/client';
import { Request } from 'express';
import { IS_ADMIN_ONLY_KEY } from 'src/decorators/admin-only.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAdminOnly = this.reflector.getAllAndOverride<boolean>(
      IS_ADMIN_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isAdminOnly) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;
    const companyId = request.params?.companyId;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // SYSTEM_ADMIN always allowed
    if (user.role === UserRoleEnum.SYSTEM_ADMIN) {
      return true;
    }

    if (!companyId) {
      throw new ForbiddenException('Empresa não identificada');
    }

    // Check if user is the company owner
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { ownerId: true },
    });

    if (company?.ownerId === user.id) {
      return true;
    }

    // Check if user has an admin role in the company
    const userRole = await this.prisma.companyUserRole.findUnique({
      where: {
        userId_companyId: {
          userId: user.id,
          companyId,
        },
      },
      include: {
        role: { select: { isAdmin: true } },
      },
    });

    if (userRole?.role?.isAdmin) {
      return true;
    }

    throw new ForbiddenException(
      'Apenas administradores podem realizar esta ação',
    );
  }
}
