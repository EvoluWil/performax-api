import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(roleId: string, { moduleId, ...rest }: CreatePermissionDto) {
    const permissionModule = await this.prisma.companyRole.findFirst({
      where: {
        permissions: { some: { moduleId } },
      },
    });

    if (permissionModule) {
      throw new ConflictException(
        `Já existe uma permissão para o módulo "${permissionModule?.name}" neste cargo.`,
      );
    }

    return this.prisma.companyRolePermission.create({
      data: {
        ...rest,
        companyRole: {
          connect: {
            id: roleId,
          },
        },
        module: {
          connect: {
            id: moduleId,
          },
        },
      },
    });
  }

  async remove(permissionId: string, roleId: string) {
    const permission = await this.prisma.companyRolePermission.findFirst({
      where: {
        id: permissionId,
        companyRoleId: roleId,
      },
    });

    if (!permission) {
      throw new NotFoundException(`Permissão não encontrada para.`);
    }

    return this.prisma.companyRolePermission.deleteMany({
      where: {
        id: permissionId,
      },
    });
  }
}
