import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';

@Injectable()
export class ExpenseTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createExpenseTypeDto: CreateExpenseTypeDto) {
    const expenseType = await this.prisma.expenseType.findFirst({
      where: { name: createExpenseTypeDto.name },
    });

    if (expenseType) {
      throw new BadRequestException('Tipo de despesa já cadastrada!');
    }

    return this.prisma.expenseType.create({
      data: {
        ...createExpenseTypeDto,
        needApprove: createExpenseTypeDto.needApprove || false,
      },
    });
  }

  async findAll() {
    const query = await this.qb.query('expenseType');

    return this.prisma.expenseType.findMany(query);
  }

  async findOne(id: string) {
    const expenseType = await this.prisma.expenseType.findFirst({
      where: { id },
    });

    if (!expenseType) {
      throw new BadRequestException('Tipo de despesa não encontrada!');
    }

    return expenseType;
  }

  async update(id: string, updateExpenseTypeDto: UpdateExpenseTypeDto) {
    const expenseType = await this.prisma.expenseType.findFirst({
      where: { id },
    });

    if (!expenseType) {
      throw new BadRequestException('Tipo de despesa não encontrada!');
    }

    return this.prisma.expenseType.update({
      where: { id },
      data: {
        ...updateExpenseTypeDto,
        needApprove: updateExpenseTypeDto.needApprove || false,
      },
    });
  }

  async remove(id: string) {
    const expenseType = await this.prisma.expenseType.findFirst({
      where: { id },
    });

    if (!expenseType) {
      throw new BadRequestException('Tipo de despesa não encontrada!');
    }

    return this.prisma.expenseType.delete({
      where: { id },
    });
  }
}
