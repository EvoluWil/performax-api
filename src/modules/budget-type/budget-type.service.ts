import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateBudgetTypeDto } from './dto/create-budget-type.dto';
import { UpdateBudgetTypeDto } from './dto/update-budget-type.dto';

@Injectable()
export class BudgetTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createBudgetTypeDto: CreateBudgetTypeDto) {
    const budgetType = await this.prisma.budgetType.findFirst({
      where: { name: createBudgetTypeDto.name },
    });

    if (budgetType) {
      throw new BadRequestException('Tipo de orçamento já cadastrado!');
    }

    return this.prisma.budgetType.create({
      data: createBudgetTypeDto,
    });
  }

  async findAll() {
    const query = await this.qb.query('budgetType');

    return this.prisma.budgetType.findMany(query);
  }

  async findOne(id: string) {
    const budgetType = await this.prisma.budgetType.findFirst({
      where: { id },
    });

    if (!budgetType) {
      throw new BadRequestException('Tipo de orçamento não encontrado!');
    }

    return budgetType;
  }

  async update(id: string, updateBudgetTypeDto: UpdateBudgetTypeDto) {
    const budgetType = await this.prisma.budgetType.findFirst({
      where: { id },
    });

    if (!budgetType) {
      throw new BadRequestException('Tipo de orçamento não encontrado!');
    }

    return this.prisma.budgetType.update({
      where: { id },
      data: updateBudgetTypeDto,
    });
  }

  async remove(id: string) {
    const budgetType = await this.prisma.budgetType.findFirst({
      where: { id },
    });

    if (!budgetType) {
      throw new BadRequestException('Tipo de orçamento não encontrado!');
    }

    return this.prisma.budgetType.delete({
      where: { id },
    });
  }
}
