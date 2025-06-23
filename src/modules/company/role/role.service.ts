import {
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
  async create(createRoleDto: CreateRoleDto, companyId: string) {
    const role = await this.prisma.companyRole.findFirst({
      where: {
        id: companyId,
        name: createRoleDto.name,
      },
    });

    if (role) {
      throw new ConflictException(
        `Já existe um cargo com o nome "${createRoleDto.name}" para esta empresa.`,
      );
    }

    return this.prisma.companyRole.create({
      data: {
        ...createRoleDto,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.companyRole.findMany({
      where: {
        companyId,
      },
      include: {
        permissions: true,
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
    updateRoleDto: UpdateRoleDto,
  ) {
    await this.findOne(roleId, companyId);

    return this.prisma.companyRole.update({
      where: {
        id: roleId,
        companyId,
      },
      data: updateRoleDto,
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
