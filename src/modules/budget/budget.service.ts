import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createBudgetDto: CreateBudgetDto, userId: string) {
    const { clientId, typeId, ...rest } = createBudgetDto;

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    const client = await this.prisma.client.findFirst({
      where: { id: clientId },
    });

    if (!client) {
      throw new BadRequestException('Cliente não encontrado!');
    }

    const type = await this.prisma.budgetType.findFirst({
      where: { id: typeId },
    });

    if (!type) {
      throw new BadRequestException('Tipo não encontrado!');
    }

    if (rest.allClients) {
      return this.prisma.budget.create({
        data: {
          ...rest,
          createdBy: { connect: { id: userId } },
          type: { connect: { id: typeId } },
        },
      });
    }

    return this.prisma.budget.create({
      data: {
        ...rest,
        createdBy: { connect: { id: userId } },
        client: { connect: { id: clientId } },
        type: { connect: { id: typeId } },
      },
    });
  }

  async findAll() {
    const query = await this.qb.query('budget');
    return this.prisma.budget.findMany(query);
  }

  async findOne(id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id },
      include: { client: true, type: true },
    });

    if (!budget) {
      throw new BadRequestException('Orçamento não encontrado!');
    }

    return budget;
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto) {
    const budget = await this.prisma.budget.findFirst({
      where: { id },
    });

    if (!budget) {
      throw new BadRequestException('Orçamento não encontrado!');
    }

    return this.prisma.budget.update({
      where: { id },
      data: updateBudgetDto,
    });
  }

  async remove(id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id },
    });

    if (!budget) {
      throw new BadRequestException('Orçamento não encontrado!');
    }

    return this.prisma.budget.delete({
      where: { id },
    });
  }
}
