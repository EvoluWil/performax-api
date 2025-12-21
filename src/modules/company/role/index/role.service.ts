import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ permissions, ...rest }: CreateRoleDto, companyId: string) {
    const role = await this.prisma.companyRole.findFirst({
      where: {
        companyId: companyId,
        name: rest.name,
      },
    });

    if (role) {
      throw new ConflictException(
        `Já existe um cargo com o nome "${rest.name}" para esta empresa.`,
      );
    }

    if (permissions && permissions.length > 0) {
      const moduleIds = permissions.map((p) => p.moduleId).filter(Boolean);
      if (moduleIds.length > 0) {
        const validModules = await this.prisma.module.findMany({
          where: { id: { in: moduleIds }, deleted: false },
          select: { id: true },
        });

        const validModuleIds = validModules.map((m) => m.id);
        const invalidIds = moduleIds.filter(
          (id) => !validModuleIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new BadRequestException(
            `Invalid module IDs: ${invalidIds.join(', ')}`,
          );
        }
      }
    }

    const hasPermissions = permissions && permissions.length > 0;
    return this.prisma.companyRole.create({
      data: {
        ...rest,
        company: {
          connect: {
            id: companyId,
          },
        },
        permissions: hasPermissions
          ? {
              createMany: {
                data: permissions,
              },
            }
          : undefined,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.companyRole.findMany({
      where: {
        companyId,
      },
      include: {
        permissions: {
          include: {
            module: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(roleId: string, companyId: string) {
    const role = await this.prisma.companyRole.findFirst({
      where: {
        id: roleId,
        companyId,
      },
      include: {
        permissions: true,
      },
    });

    if (!role) {
      throw new NotFoundException('Cargo não encontrado');
    }

    return role;
  }

  async update(
    roleId: string,
    companyId: string,
    { permissions, ...rest }: UpdateRoleDto,
  ) {
    await this.findOne(roleId, companyId);
    const hasPermissions = permissions && permissions.length > 0;
    return this.prisma.companyRole.update({
      where: {
        id: roleId,
        companyId,
      },
      data: {
        ...rest,
        permissions: {
          deleteMany: {},
          createMany: hasPermissions
            ? {
                data: permissions,
              }
            : undefined,
        },
      },
    });
  }

  async remove(roleId: string, companyId: string) {
    await this.findOne(roleId, companyId);

    return this.prisma.companyRole.delete({
      where: {
        id: roleId,
        companyId,
      },
    });
  }
}
