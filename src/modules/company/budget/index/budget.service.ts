import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BudgetStatusEnum } from '@prisma/client';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { isValidObjectId } from 'src/utils/is-valid-object-id.util';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
    private readonly qb: QBService,
  ) {}

  private assertValidCompanyId(companyId: string) {
    if (!isValidObjectId(companyId)) {
      throw new BadRequestException('ID de empresa inválido');
    }
  }

  async create(
    createBudgetDto: CreateBudgetDto,
    companyId: string,
    userId: string,
  ) {
    this.assertValidCompanyId(companyId);

    const budgetType = await this.prisma.companyBudgetType.findUnique({
      where: { id: createBudgetDto.typeId },
    });

    const data = normalizeRelations(createBudgetDto) as any;
    const protocol = await this.util.generateUniqueProtocol('companyBudget');

    const budget = await this.prisma.companyBudget.create({
      data: {
        ...data,
        status: BudgetStatusEnum.PENDING,
        approved: budgetType?.needApprove ? false : true,
        company: { connect: { id: companyId } },
        createdBy: { connect: { id: userId } },
        protocol,
      },
    });

    return budget;
  }

  async findAll(companyId: string) {
    this.assertValidCompanyId(companyId);

    const where = { companyId, deleted: false };
    const { count, query } = await this.qb.query('companyBudget', where);
    const budgets = await this.prisma.companyBudget.findMany({
      ...query,
    });
    return { count, data: budgets };
  }

  async findOne(budgetId: string, companyId: string) {
    this.assertValidCompanyId(companyId);

    const budget = await this.prisma.companyBudget.findUnique({
      where: { id: budgetId, companyId },
      include: {
        client: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        type: true,
        responsible: { select: { id: true, name: true } },
      },
    });

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    return budget;
  }

  async update(
    budgetId: string,
    companyId: string,
    updateBudgetDto: UpdateBudgetDto,
  ) {
    await this.findOne(budgetId, companyId);

    return this.prisma.companyBudget.update({
      where: { id: budgetId },
      data: updateBudgetDto,
    });
  }

  async approve(budgetId: string, companyId: string, approved: boolean) {
    await this.findOne(budgetId, companyId);

    return this.prisma.companyBudget.update({
      where: { id: budgetId },
      data: approved
        ? { approved: true }
        : { approved: true, status: BudgetStatusEnum.REJECTED },
    });
  }

  async remove(budgetId: string, companyId: string) {
    await this.findOne(budgetId, companyId);

    return this.prisma.companyBudget.update({
      where: { id: budgetId },
      data: { deleted: true },
    });
  }
}
