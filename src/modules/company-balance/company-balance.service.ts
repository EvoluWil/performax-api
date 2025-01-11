import { Injectable, NotFoundException } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCompanyBalanceDto } from './dto/create-company-balance.dto';
import { UpdateCompanyBalanceDto } from './dto/update-company-balance.dto';

@Injectable()
export class CompanyBalanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
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
    return this.prisma.companyBalance.findMany(query);
  }

  async findOne(id: string) {
    const companyBalance = await this.prisma.companyBalance.findFirst({
      where: { id },
    });

    if (!companyBalance) {
      throw new NotFoundException('Saldo de empresa não encontrado!');
    }

    return companyBalance;
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

    return this.prisma.companyBalance.update({
      where: { id },
      data: {
        initialValue: updateCompanyBalanceDto.initialValue,
      },
    });
  }

  async remove(id: string) {
    const companyBalance = await this.prisma.companyBalance.findFirst({
      where: { id },
    });

    if (!companyBalance) {
      throw new NotFoundException('Saldo de empresa não encontrado!');
    }

    return this.prisma.companyBalance.delete({
      where: { id },
    });
  }
}
