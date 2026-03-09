import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';

@Injectable()
export class FinanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
    private readonly util: UtilService,
  ) {}

  async create(
    { isRecurring, recurringEndDate, ...rest }: CreateFinanceDto,
    userId: string,
    companyId: string,
  ) {
    const type = await this.prisma.companyFinanceType.findUnique({
      where: { id: rest.typeId },
    });

    const data = normalizeRelations(rest) as any;
    const protocol = await this.util.generateUniqueProtocol('companyFinance');

    const finance = await this.prisma.companyFinance.create({
      data: {
        ...data,
        protocol,
        status: type?.needApprove ? 'PENDING' : 'APPROVED',
        createdBy: { connect: { id: userId } },
        company: { connect: { id: companyId } },
      },
    });

    if (isRecurring) {
      await this.prisma.companyFinanceRecurring.create({
        data: {
          ...data,
          endDate: recurringEndDate || null,
          lastDate: data.date,
          company: { connect: { id: companyId } },
        },
      });
    }

    return finance;
  }

  async findAll(companyId: string) {
    const where = { companyId, deleted: false };
    const { count, query } = await this.qb.query('finance', where);
    const financials = await this.prisma.companyFinance.findMany({
      ...query,
    });
    return {
      data: financials,
      count,
    };
  }

  // async findData() {
  //   const select = {
  //     id: true,
  //     name: true,
  //   };

  //   const orderBy: unknown = { name: 'asc' };

  //   const clients = await this.prisma.client.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const types = await this.prisma.financeType.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const methods = await this.prisma.paymentMethod.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const banks = await this.prisma.bank.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const users = await this.prisma.user.findMany({
  //     select,
  //     orderBy,
  //     where: { active: true },
  //   });

  //   const companies = await this.prisma.company.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const categories = await this.prisma.financeCategory.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const favored = await this.prisma.financeFavored.findMany({
  //     select,
  //     orderBy,
  //   });

  //   const employees = await this.prisma.employee.findMany({
  //     select,
  //     orderBy,
  //   });

  //   return {
  //     clients,
  //     types,
  //     users,
  //     banks,
  //     methods,
  //     companies,
  //     categories,
  //     favored,
  //     employees,
  //   };
  // }

  async findOne(financeId: string, companyId: string) {
    const finance = await this.prisma.companyFinance.findFirst({
      where: { id: financeId, companyId, deleted: false },
      include: {
        client: true,
        type: true,
        createdBy: { select: { name: true, id: true } },
        method: true,
        bank: true,
        category: true,
        company: true,
        payee: true,
        employee: true,
        companyIn: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!finance) {
      throw new BadRequestException('Lançamento não encontrado!');
    }

    return finance;
  }

  async update(
    financeId: string,
    companyId: string,
    updateFinanceDto: UpdateFinanceDto,
  ) {
    const finance = await this.prisma.companyFinance.findFirst({
      where: { id: financeId, companyId },
    });

    if (!finance) {
      throw new BadRequestException('Despesa não encontrada!');
    }

    const data = normalizeRelations(updateFinanceDto);

    await this.prisma.companyFinance.update({
      where: { id: financeId },
      data,
    });

    return { ok: true };
  }

  async remove(financeId: string, companyId: string) {
    const finance = await this.prisma.companyFinance.findFirst({
      where: { id: financeId, companyId },
    });

    if (!finance) {
      throw new BadRequestException('Despesa não encontrada!');
    }

    return this.prisma.companyFinance.update({
      where: { id: financeId },
      data: { deleted: true },
    });
  }
}
