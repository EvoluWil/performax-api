import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto, companyId: string) {
    return await this.prisma.companyRole.create({
      data: {
        ...createRoleDto,
        companyId,
      },
      include: {
        permissions: {
          include: {
            module: true,
          },
        },
      },
    });
  }

  async findAll(companyId: string) {
    return await this.prisma.companyRole.findMany({
      where: { companyId },
      include: {
        permissions: {
          include: {
            module: true,
          },
        },
        _count: {
          select: {
            companyUser: true,
          },
        },
      },
    });
  }

  async findOne(id: string, companyId: string) {
    const role = await this.prisma.companyRole.findFirst({
      where: { id, companyId },
      include: {
        permissions: {
          include: {
            module: true,
          },
        },
        companyUser: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, companyId: string) {
    await this.findOne(id, companyId); // Verifica se existe

    return await this.prisma.companyRole.update({
      where: { id },
      data: updateRoleDto,
      include: {
        permissions: {
          include: {
            module: true,
          },
        },
      },
    });
  }

  async remove(id: string, companyId: string) {
    await this.findOne(id, companyId); // Verifica se existe

    // Verifica se há usuários usando este role
    const usersCount = await this.prisma.companyUserRole.count({
      where: { roleId: id },
    });

    if (usersCount > 0) {
      throw new BadRequestException(
        'Cannot delete role that is being used by users',
      );
    }

    return await this.prisma.companyRole.delete({
      where: { id },
    });
  }

  // Métodos para controle do CompanyUserRole

  /**
   * Atribui um role a um usuário na empresa
   */
  async assignUserRole(userId: string, companyId: string, roleId: string) {
    // Verifica se o role existe na empresa
    await this.findOne(roleId, companyId);

    // Verifica se o usuário já tem role na empresa
    const existingUserRole = await this.prisma.companyUserRole.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (existingUserRole) {
      // Atualiza o role existente
      return await this.prisma.companyUserRole.update({
        where: {
          userId_companyId: {
            userId,
            companyId,
          },
        },
        data: {
          roleId,
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  module: true,
                },
              },
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
    }

    // Cria nova associação usuário-empresa com role
    return await this.prisma.companyUserRole.create({
      data: {
        userId,
        companyId,
        roleId,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                module: true,
              },
            },
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
  }

  /**
   * Remove role de um usuário na empresa
   */
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
      throw new NotFoundException('User role not found');
    }

    return await this.prisma.companyUserRole.update({
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
  }

  /**
   * Atribui clientes a um usuário na empresa
   */
  async assignUserClients(
    userId: string,
    companyId: string,
    clientIds: string[],
  ) {
    // Verifica se todos os clientes pertencem à empresa
    const clients = await this.prisma.companyClient.findMany({
      where: {
        id: { in: clientIds },
        companyId,
      },
    });

    if (clients.length !== clientIds.length) {
      throw new BadRequestException(
        'Some clients do not belong to this company',
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
      throw new NotFoundException('User not found in company');
    }

    return await this.prisma.companyUserRole.update({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      data: {
        clientIds,
      },
      include: {
        clients: {
          select: {
            id: true,
            name: true,
            cnpj: true,
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
  }

  /**
   * Atribui usuários supervisionados (targets) a um usuário na empresa
   */
  async assignUserTargets(
    userId: string,
    companyId: string,
    targetIds: string[],
  ) {
    // Verifica se todos os targets existem e pertencem à empresa
    const targets = await this.prisma.companyUserRole.findMany({
      where: {
        userId: { in: targetIds },
        companyId,
      },
    });

    if (targets.length !== targetIds.length) {
      throw new BadRequestException(
        'Some target users do not belong to this company',
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
      throw new NotFoundException('User not found in company');
    }

    return await this.prisma.companyUserRole.update({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      data: {
        targetIds,
      },
      include: {
        targets: {
          select: {
            id: true,
            name: true,
            email: true,
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
  }

  /**
   * Busca informações completas do usuário na empresa
   */
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
          include: {
            permissions: {
              include: {
                module: true,
              },
            },
          },
        },
        clients: {
          select: {
            id: true,
            name: true,
            cnpj: true,
          },
        },
        targets: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            cpf: true,
          },
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException('User not found in company');
    }

    return userRole;
  }

  /**
   * Lista todos os usuários de uma empresa com seus roles
   */
  async getCompanyUsers(companyId: string) {
    return await this.prisma.companyUserRole.findMany({
      where: { companyId },
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
        _count: {
          select: {
            targets: true,
            clients: true,
          },
        },
      },
    });
  }
}
