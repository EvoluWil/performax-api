import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCompanyGroupDto } from './dto/create-company-group.dto';
import { UpdateCompanyGroupDto } from './dto/update-company-group.dto';

@Injectable()
export class CompanyGroupService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompanyGroupDto: CreateCompanyGroupDto) {
    return this.prisma.companyGroup.create({
      data: createCompanyGroupDto,
    });
  }

  findAll() {
    return this.prisma.companyGroup.findMany({
      include: { companies: { select: { id: true, name: true } } },
    });
  }

  async findOne(groupId: string) {
    const group = await this.prisma.companyGroup.findUnique({
      where: { id: groupId },
      include: { companies: { select: { id: true, name: true } } },
    });

    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }

    return group;
  }

  async update(groupId: string, updateCompanyGroupDto: UpdateCompanyGroupDto) {
    await this.findOne(groupId);

    return this.prisma.companyGroup.update({
      where: { id: groupId },
      data: updateCompanyGroupDto,
    });
  }

  async remove(groupId: string) {
    await this.findOne(groupId);

    return this.prisma.companyGroup.delete({
      where: { id: groupId },
    });
  }

  getCompanies(groupId: string) {
    return this.prisma.company.findMany({
      where: { groupId, deleted: false },
      select: { id: true, name: true },
    });
  }

  async assignGroup(companyId: string, groupId: string | null) {
    return this.prisma.company.update({
      where: { id: companyId },
      data: { groupId },
    });
  }
}
