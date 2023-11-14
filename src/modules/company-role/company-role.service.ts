import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto';

@Injectable()
export class CompanyRoleService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCompanyRoleDto: CreateCompanyRoleDto) {
    const { sectorId, name } = createCompanyRoleDto;

    const sector = await this.prisma.sector.findFirst({
      where: { id: sectorId },
    });

    if (!sector) {
      throw new BadRequestException('Setor não encontrado');
    }

    delete createCompanyRoleDto.sectorId;

    return this.prisma.role.create({
      data: {
        name,
        sector: {
          connect: {
            id: sectorId,
          },
        },
      },
    });
  }

  async update(roleId: string, updateCompanyRoleDto: UpdateCompanyRoleDto) {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException('Cargo não encontrado');
    }

    return this.prisma.role.update({
      where: { id: roleId },
      data: updateCompanyRoleDto,
    });
  }

  async remove(roleId: string) {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException('Cargo não encontrado');
    }

    return this.prisma.role.delete({
      where: { id: roleId },
    });
  }
}
