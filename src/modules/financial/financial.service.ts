import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { generateProtocol } from 'src/utils/generate-protocol';
import { CreateFinancialDto } from './dto/create-financial.dto';
import { UpdateFinancialDto } from './dto/update-financial.dto';

@Injectable()
export class FinancialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(
    { isRecurring, recurringEndDate, ...rest }: CreateFinancialDto,
    userId: string,
  ) {
    const type = await this.prisma.financialType.findFirst({
      where: { id: rest.typeId },
    });

    if (!type) {
      throw new BadRequestException('Tipo de despesa não encontrado!');
    }

    const data = Object.entries(rest).reduce((acc, [key, value]) => {
      if (!value) {
        return acc;
      }

      if (key?.includes('Id')) {
        const newKey = key.replace('Id', '');
        return { ...acc, [newKey]: { connect: { id: value } } };
      }

      return { ...acc, [key]: value };
    }, {} as any);

    await this.prisma.financial.create({
      data: {
        ...data,
        status: type?.needApprove ? 'PENDING' : 'APPROVED',
        protocol: generateProtocol(),
        createdBy: { connect: { id: userId } },
      },
    });

    if (isRecurring) {
      await this.prisma.recurringFinancial.create({
        data: { ...data, endDate: recurringEndDate, lastDate: data.date },
      });
    }

    return { ok: true };
  }

  async findAll() {
    const query = await this.qb.query('financial');
    return this.prisma.financial.findMany(query);
  }

  async findData() {
    const select = {
      id: true,
      name: true,
    };

    const orderBy: unknown = { name: 'asc' };

    const clients = await this.prisma.client.findMany({
      select,
      orderBy,
    });

    const types = await this.prisma.financialType.findMany({
      select,
      orderBy,
    });

    const methods = await this.prisma.paymentMethod.findMany({
      select,
      orderBy,
    });

    const banks = await this.prisma.bank.findMany({
      select,
      orderBy,
    });

    const users = await this.prisma.user.findMany({
      select,
      orderBy,
    });

    const companies = await this.prisma.company.findMany({
      select,
      orderBy,
    });

    const categories = await this.prisma.financialCategory.findMany({
      select,
      orderBy,
    });

    return {
      clients,
      types,
      users,
      banks,
      methods,
      companies,
      categories,
    };
  }

  async findOne(id: string) {
    const financial = await this.prisma.financial.findFirst({
      where: { id },
      include: {
        client: true,
        type: true,
        createdBy: { select: { name: true } },
        method: true,
        bank: true,
      },
    });

    if (!financial) {
      throw new BadRequestException('Despesa não encontrada!');
    }

    return financial;
  }

  async update(id: string, updateFinancialDto: UpdateFinancialDto) {
    const data = Object.entries(updateFinancialDto).reduce(
      (acc, [key, value]) => {
        if (!value) {
          return acc;
        }

        if (key?.includes('Id')) {
          const newKey = key.replace('Id', '');
          return { ...acc, [newKey]: { connect: { id: value } } };
        }

        return { ...acc, [key]: value };
      },
      {},
    );

    await this.prisma.financial.update({
      where: { id },
      data,
    });

    return { ok: true };
  }

  async remove(id: string) {
    const financial = await this.prisma.financial.findFirst({
      where: { id },
    });

    if (!financial) {
      throw new BadRequestException('Despesa não encontrada!');
    }

    return this.prisma.financial.delete({
      where: { id },
    });
  }
}
