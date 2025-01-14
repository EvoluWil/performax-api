import { Injectable, NotFoundException } from '@nestjs/common';
import { isToday } from 'date-fns';
import { CacheService } from 'src/providers/cache/cache.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { formatCurrency } from 'src/utils/calculate-financial.util';
import { CreateCompanyBalanceDto } from './dto/create-company-balance.dto';
import { UpdateCompanyBalanceDto } from './dto/update-company-balance.dto';

@Injectable()
export class CompanyBalanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
    private readonly cache: CacheService,
  ) {}

  async create({ companyId, initialValue }: CreateCompanyBalanceDto) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada!');
    }

    await this.prisma.companyBalance.create({
      data: {
        company: { connect: { id: companyId } },
        initialValue,
      },
    });

    return { ok: true };
  }

  async findAll() {
    const query = await this.qb.query('companyBalance');
    delete query.select;
    const balances = await this.prisma.companyBalance.findMany(query);
    return Promise.all(
      balances.map((balance) =>
        this.calculateCompanyBalance(balance.companyId),
      ),
    );
  }

  async findOne(id: string) {
    const companyBalance = await this.prisma.companyBalance.findFirst({
      where: { id },
    });

    if (!companyBalance) {
      throw new NotFoundException('Saldo de empresa não encontrado!');
    }

    return this.calculateCompanyBalance(companyBalance.companyId);
  }

  async update(id: string, updateCompanyBalanceDto: UpdateCompanyBalanceDto) {
    const companyBalance = await this.prisma.companyBalance.findFirst({
      where: { id },
    });

    if (!companyBalance) {
      throw new NotFoundException('Saldo de empresa não encontrado!');
    }

    if (!updateCompanyBalanceDto.initialValue) {
      return { ok: false, message: 'Valor inicial é obrigatório!' };
    }

    await this.prisma.companyBalance.update({
      where: { id },
      data: {
        initialValue: updateCompanyBalanceDto.initialValue,
      },
    });

    return { ok: true };
  }

  async remove(id: string) {
    const companyBalance = await this.prisma.companyBalance.findFirst({
      where: { id },
    });

    if (!companyBalance) {
      throw new NotFoundException('Saldo de empresa não encontrado!');
    }

    await this.prisma.companyBalance.delete({
      where: { id },
    });

    return { ok: true };
  }

  async calculateCompanyBalance(companyId: string) {
    const companyBalance = await this.prisma.companyBalance.findFirst({
      include: { company: { select: { name: true, id: true } } },
      where: { companyId },
    });

    if (!companyBalance) {
      throw new NotFoundException('Saldo de empresa não encontrado!');
    }

    const cachedValue = await this.cache.getValue(
      `company-${companyId}-balance`,
    );

    if (cachedValue) {
      const cacheFormatted = JSON.parse(cachedValue);
      if (isToday(new Date(cacheFormatted.balancedAt))) {
        return cacheFormatted;
      }
    }

    const transactions = await this.prisma.financial.findMany({
      where: {
        OR: [{ companyId }, { companyInId: companyId }],
      },
    });

    const totalBalance = transactions.reduce(
      (acc, transaction) => {
        const finalValue =
          formatCurrency(transaction.value) +
          formatCurrency(transaction.tax) -
          formatCurrency(transaction.retention);

        if (transaction.companyInId === companyId) {
          if (transaction?.status === 'PAID') {
            const balance = acc.balance + finalValue;

            return { ...acc, balance };
          }

          const futureBalance = acc.futureBalance + finalValue;
          return { ...acc, futureBalance };
        }

        if (transaction.flow === 'IN') {
          if (transaction?.status === 'PAID') {
            const balance = acc.balance + finalValue;
            return { ...acc, balance };
          }

          const futureBalance = acc.futureBalance + finalValue;
          return { ...acc, futureBalance };
        }

        if (transaction?.status === 'PAID') {
          const balance = acc.balance - finalValue;
          return { ...acc, balance };
        }

        const futureBalance = acc.futureBalance - finalValue;
        return { ...acc, futureBalance };
      },
      {
        company: companyBalance.company,
        id: companyBalance.id,
        initialValue: formatCurrency(companyBalance.initialValue),
        balance: formatCurrency(companyBalance.initialValue),
        futureBalance: 0,
        total: 0,
        balancedAt: new Date(),
      },
    );

    totalBalance.total = totalBalance.balance + totalBalance.futureBalance;

    await this.cache.setValue(
      `company-${companyId}-balance`,
      JSON.stringify(totalBalance),
      86400,
    );
    return totalBalance;
  }
}
