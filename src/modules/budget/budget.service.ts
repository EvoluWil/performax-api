import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { generateProtocol } from 'src/utils/generate-protocol';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(
    companyId: string,
    createBudgetDto: CreateBudgetDto,
    userId: string,
    increment = 1,
  ) {
    const { clientId, typeId, taskId, closeTaskId, responsibleId, ...rest } =
      createBudgetDto;

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    if (!user?.companiesId?.includes(companyId)) {
      throw new BadRequestException('Usuário não pertence à empresa!');
    }

    const client = await this.prisma.client.findFirst({
      where: {
        id: clientId,
        companiesId: { has: companyId },
      },
    });

    if (!client) {
      throw new BadRequestException('Cliente não encontrado!');
    }

    const type = await this.prisma.budgetType.findFirst({
      where: { id: typeId, companyId },
    });

    if (!type) {
      throw new BadRequestException('Tipo não encontrado!');
    }

    if (responsibleId) {
      const responsible = await this.prisma.user.findFirst({
        where: { id: responsibleId, companiesId: { has: companyId } },
      });

      if (!responsible) {
        throw new BadRequestException('Responsável não encontrado!');
      }
    }

    const generatedProtocol = generateProtocol() + increment;

    const budget = await this.prisma.budget.findFirst({
      where: { protocol: generatedProtocol },
    });

    if (budget) {
      return this.create(companyId, createBudgetDto, userId, increment + 1);
    }

    if (taskId) {
      (rest as any).task = {
        connect: { id: taskId },
      };
    }

    if (closeTaskId) {
      (rest as any).closeTask = {
        connect: { id: closeTaskId },
      };
    }

    return this.prisma.budget.create({
      data: {
        ...rest,
        responsible: { connect: { id: responsibleId || userId } },
        protocol: generatedProtocol,
        createdBy: { connect: { id: userId } },
        client: { connect: { id: clientId } },
        type: { connect: { id: typeId } },
        company: { connect: { id: companyId } },
      },
    });
  }

  async findAll(companyId: string) {
    const query = await this.qb.query('budget');
    return this.prisma.budget.findMany({
      where: { companyId },
      ...query,
    });
  }

  async findOne(id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id },
      include: {
        client: true,
        type: true,
        createdBy: {
          select: { id: true, name: true },
        },
        task: true,
        responsible: {
          select: { id: true, name: true },
        },
      },
    });

    if (!budget) {
      throw new BadRequestException('Orçamento não encontrado!');
    }

    return budget;
  }

  async update(
    id: string,
    { clientId, responsibleId, typeId, ...rest }: UpdateBudgetDto,
  ) {
    const budget = await this.prisma.budget.findFirst({
      where: { id },
    });

    if (!budget) {
      throw new BadRequestException('Orçamento não encontrado!');
    }

    const updateBudget: any = { ...rest };

    if (responsibleId) {
      const responsible = await this.prisma.user.findFirst({
        where: { id: responsibleId },
      });

      if (!responsible) {
        throw new BadRequestException('Responsável não encontrado!');
      }

      updateBudget.responsible = { connect: { id: responsibleId } };
    }

    if (typeId) {
      const type = await this.prisma.budgetType.findFirst({
        where: { id: typeId },
      });

      if (!type) {
        throw new BadRequestException('Tipo não encontrado!');
      }

      updateBudget.type = { connect: { id: typeId } };
    }

    if (clientId) {
      const client = await this.prisma.client.findFirst({
        where: { id: clientId },
      });

      if (!client) {
        throw new BadRequestException('Cliente não encontrado!');
      }

      updateBudget.client = { connect: { id: clientId } };
    }

    return this.prisma.budget.update({
      where: { id },
      data: updateBudget,
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
