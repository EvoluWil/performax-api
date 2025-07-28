import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}
  create(createCompanyDto: CreateCompanyDto, userId: string) {
    return this.prisma.company.create({
      data: {
        ...createCompanyDto,
        owner: { connect: { id: userId } },
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

    return this.prisma.company.update({
      where: {
        id: companyId,
      },
      data: updateCompanyDto,
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
