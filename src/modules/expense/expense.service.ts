import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { generateProtocol } from 'src/utils/generate-protocol';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string) {
    const { clientId, typeId, ...rest } = createExpenseDto;

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

    const type = await this.prisma.expenseType.findFirst({
      where: { id: typeId },
    });

    if (!type) {
      throw new BadRequestException('Tipo não encontrado!');
    }

    return this.prisma.expense.create({
      data: {
        ...rest,
        protocol: generateProtocol(),
        createdBy: { connect: { id: userId } },
        client: { connect: { id: clientId } },
        type: { connect: { id: typeId } },
      },
    });
  }

  async findAll() {
    const query = await this.qb.query('expense');
    return this.prisma.expense.findMany(query);
  }

  async findOne(id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id },
      include: {
        client: true,
        type: true,
        createdBy: { select: { name: true } },
      },
    });

    if (!expense) {
      throw new BadRequestException('Despesa não encontrada!');
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findFirst({
      where: { id },
    });

    if (!expense) {
      throw new BadRequestException('Despesa não encontrada!');
    }

    const updateExpense: any = { ...updateExpenseDto };

    if (updateExpense.clientId) {
      updateExpense.client = { connect: { id: updateExpenseDto.clientId } };
      delete updateExpense.clientId;
    }

    if (updateExpense.typeId) {
      updateExpense.type = { connect: { id: updateExpenseDto.typeId } };
      delete updateExpense.typeId;
    }

    return this.prisma.expense.update({
      where: { id },
      data: updateExpense,
    });
  }

  async remove(id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id },
    });

    if (!expense) {
      throw new BadRequestException('Despesa não encontrada!');
    }

    return this.prisma.expense.delete({
      where: { id },
    });
  }
}
