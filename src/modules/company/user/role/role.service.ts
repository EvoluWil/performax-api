import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async assignUserRole(userId: string, companyId: string, roleId: string) {
    const role = await this.prisma.companyRole.findFirst({
      where: { id: roleId, companyId },
    });

    if (!role) {
      throw new NotFoundException('Cargo não encontrado na empresa');
    }

    const existingUserRole = await this.prisma.companyUserRole.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (existingUserRole) {
      await this.prisma.companyUserRole.update({
        where: {
          userId_companyId: {
            userId,
            companyId,
          },
        },
        data: {
          roleId,
        },
      });

      return { ok: true };
    }

    await this.prisma.companyUserRole.create({
      data: {
        userId,
        companyId,
        roleId,
      },
    });

    return { ok: true };
  }

  async removeUserRole(userId: string, companyId: string) {
    const userRole = await this.prisma.companyUserRole.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException('Cargo do usuário não encontrado');
    }

    await this.prisma.companyUserRole.update({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      data: {
        roleId: null,
      },
    });

    return { ok: true };
  }

  async assignUserClients(
    userId: string,
    companyId: string,
    clientIds: string[],
  ) {
    const clients = await this.prisma.companyClient.findMany({
      where: {
        id: { in: clientIds },
        companyId,
      },
    });

    if (clients.length !== clientIds.length) {
      throw new BadRequestException(
        'Alguns clientes não pertencem a esta empresa',
      );
    }

    const userRole = await this.prisma.companyUserRole.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException('Usuário não encontrado na empresa');
    }

    await this.prisma.companyUserRole.update({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      data: {
        clientIds,
      },
    });

    return { ok: true };
  }

  async assignUserTargets(
    userId: string,
    companyId: string,
    targetIds: string[],
  ) {
    const targets = await this.prisma.companyUserRole.findMany({
      where: {
        userId: { in: targetIds },
        companyId,
      },
    });

    if (targets.length !== targetIds.length) {
      throw new BadRequestException(
        'Alguns usuários supervisionados não pertencem a esta empresa',
      );
    }

    const userRole = await this.prisma.companyUserRole.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException('Usuário não encontrado na empresa');
    }

    await this.prisma.companyUserRole.update({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      data: {
        targetIds,
      },
    });

    return { ok: true };
  }

  async getUserRoleInCompany(userId: string, companyId: string) {
    const userRole = await this.prisma.companyUserRole.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            isAdmin: true,
          },
        },
        clients: {
          select: {
            id: true,
            name: true,
          },
        },
        targets: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException('Usuário não encontrado na empresa');
    }

    return userRole;
  }
}
