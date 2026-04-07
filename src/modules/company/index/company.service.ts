import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}
  create(createCompanyDto: CreateCompanyDto, userId: string) {
    const { groupId, ...rest } = createCompanyDto;
    return this.prisma.company.create({
      data: {
        ...rest,
        owner: { connect: { id: userId } },
        ...(groupId ? { group: { connect: { id: groupId } } } : {}),
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.company.findMany({
      where: {
        OR: [{ ownerId: userId }, { userCompany: { some: { userId } } }],
        deleted: false,
      },
    });
  }

  findOwned(userId: string) {
    return this.prisma.company.findMany({
      where: { ownerId: userId, deleted: false },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(companyId: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        id: companyId,
        OR: [{ ownerId: userId }, { userCompany: { some: { userId } } }],
        deleted: false,
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async update(
    companyId: string,
    userId: string,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    await this.findOne(companyId, userId);

    const { groupId, ...rest } = updateCompanyDto;

    return this.prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        ...rest,
        ...(groupId !== undefined
          ? {
              group: groupId
                ? { connect: { id: groupId } }
                : { disconnect: true },
            }
          : {}),
      },
    });
  }

  async linkCompanies(
    companyId: string,
    targetCompanyId: string,
    userId: string,
  ) {
    const [company, target] = await Promise.all([
      this.prisma.company.findFirst({
        where: { id: companyId, ownerId: userId, deleted: false },
      }),
      this.prisma.company.findFirst({
        where: { id: targetCompanyId, ownerId: userId, deleted: false },
      }),
    ]);

    if (!company || !target) {
      throw new NotFoundException('Empresa não encontrada');
    }

    let groupId = company.groupId;

    if (!groupId) {
      const group = await this.prisma.companyGroup.create({
        data: { name: company.name },
      });
      groupId = group.id;
      await this.prisma.company.update({
        where: { id: companyId },
        data: { group: { connect: { id: groupId } } },
      });
    }

    return this.prisma.company.update({
      where: { id: targetCompanyId },
      data: { group: { connect: { id: groupId } } },
    });
  }

  async unlinkCompany(targetCompanyId: string, userId: string) {
    const target = await this.prisma.company.findFirst({
      where: { id: targetCompanyId, ownerId: userId, deleted: false },
    });

    if (!target) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.prisma.company.update({
      where: { id: targetCompanyId },
      data: { group: { disconnect: true } },
    });
  }

  async remove(companyId: string, userId: string) {
    await this.findOne(companyId, userId);

    return this.prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
