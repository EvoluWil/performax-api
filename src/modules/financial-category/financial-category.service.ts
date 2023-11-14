import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFinancialCategoryDto } from './dto/create-financial-category.dto';
import { UpdateFinancialCategoryDto } from './dto/update-financial-category.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';

@Injectable()
export class FinancialCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(
    createFinancialCategoryDto: CreateFinancialCategoryDto,
    companyId: string,
  ) {
    return this.prisma.financialCategory.create({
      data: {
        ...createFinancialCategoryDto,
        company: { connect: { id: companyId } },
      },
    });
  }

  async findAll() {
    const query = await this.qb.query('financialCategory');
    const financialCategories = await this.prisma.financialCategory.findMany(
      query,
    );
    return financialCategories;
  }

  async findOne(id: string) {
    const query = await this.qb.query('financialCategory');
    const financialCategory = await this.prisma.financialCategory.findFirst({
      ...query,
      where: { id },
    });

    if (!financialCategory) {
      throw new BadRequestException('Categoria não encontrada');
    }

    return financialCategory;
  }

  async update(
    id: string,
    updateFinancialCategoryDto: UpdateFinancialCategoryDto,
  ) {
    const financialCategory = await this.prisma.financialCategory.findFirst({
      where: { id },
    });

    if (!financialCategory) {
      throw new BadRequestException('Categoria não encontrada');
    }

    return this.prisma.financialCategory.update({
      where: { id },
      data: updateFinancialCategoryDto,
    });
  }

  async remove(id: string) {
    const financialCategory = await this.prisma.financialCategory.findFirst({
      where: { id },
    });

    if (!financialCategory) {
      throw new BadRequestException('Categoria não encontrada');
    }

    return this.prisma.financialCategory.delete({
      where: { id },
    });
  }
}
