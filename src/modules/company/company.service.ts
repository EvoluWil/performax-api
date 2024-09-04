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

  async create(createCompanyDto: CreateCompanyDto) {
    const company = await this.prisma.company.findFirst({
      where: { name: createCompanyDto.name },
    });

    if (company) {
      throw new BadRequestException('Empresa já cadastrada!');
    }

    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async findAll() {
    const query = await this.qb.query('company');

    return this.prisma.company.findMany(query);
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findFirst({
      where: { id },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada!');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.prisma.company.findFirst({
      where: { id },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada!');
    }

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }
}
