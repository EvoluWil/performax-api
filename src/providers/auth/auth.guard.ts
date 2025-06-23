import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from '@prisma/client';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { IS_SYSTEM_ADMIN_KEY } from 'src/decorators/system-admin.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isSystemAdmin = this.reflector.getAllAndOverride<boolean>(
      IS_SYSTEM_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não enviado');
    }

    try {
      const { id } = await this.jwtService.verifyAsync(token);

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      if (isSystemAdmin) {
        if (user.role !== UserRoleEnum.SYSTEM_ADMIN) {
          throw new UnauthorizedException('Usuário não autorizado');
        }
      }

      request.user = user;
    } catch (err) {
      throw new UnauthorizedException('Usuário não autorizado');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return undefined;
    }

    const [type, token] = parts;
    return type === 'Bearer' ? token : undefined;
  }
}
