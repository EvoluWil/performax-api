import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateFinancialCategoryDto } from './dto/create-financial-category.dto';
import { UpdateFinancialCategoryDto } from './dto/update-financial-category.dto';

@Injectable()
export class FinancialCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createFinancialCategoryDto: CreateFinancialCategoryDto) {
    const financialCategory = await this.prisma.financialCategory.findFirst({
      where: { name: createFinancialCategoryDto.name },
    });

    if (financialCategory) {
      throw new BadRequestException('Categoria de lançamento já cadastrada!');
    }

    return this.prisma.financialCategory.create({
      data: createFinancialCategoryDto,
    });
  }

  async findAll() {
    const query = await this.qb.query('financialCategory');

    return this.prisma.financialCategory.findMany(query);
  }

  async findOne(id: string) {
    const financialCategory = await this.prisma.financialCategory.findFirst({
      where: { id },
    });

    if (!financialCategory) {
      throw new BadRequestException('Categoria de lançamento não encontrada!');
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
      throw new BadRequestException('Categoria de lançamento não encontrada!');
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
      throw new BadRequestException('Categoria de lançamento não encontrada!');
    }

    return this.prisma.financialCategory.delete({
      where: { id },
    });
  }
}
