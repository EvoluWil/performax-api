import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: { name: createCompanyDto.name, ownerId: userId },
    });

    if (company) {
      throw new BadRequestException('Empresa já cadastrada!');
    }

    return this.prisma.company.create({
      data: {
        ...createCompanyDto,
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    const query = await this.qb.query('company');

    return this.prisma.company.findMany({
      where: {
        OR: [
          {
            ownerId: userId,
          },
          {
            usersId: { has: userId },
          },
        ],
      },
      ...query,
    });
  }

  async findOne(companyId: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        id: companyId,
        OR: [
          {
            ownerId: userId,
          },
          {
            usersId: { has: userId },
          },
        ],
      },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada!');
    }

    return company;
  }

  async update(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
    userId: string,
  ) {
    const company = await this.prisma.company.findFirst({
      where: {
        id: companyId,
        OR: [
          {
            ownerId: userId,
          },
          {
            usersId: { has: userId },
          },
        ],
      },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada!');
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: updateCompanyDto,
    });
  }
}
