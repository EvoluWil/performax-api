import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFinancialContractDto } from './dto/create-financial-contract.dto';
import { UpdateFinancialContractDto } from './dto/update-financial-contract.dto';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class FinancialContractService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(
    createFinancialContractDto: CreateFinancialContractDto,
    companyId: string,
  ) {
    return this.prisma.financialContract.create({
      data: {
        ...createFinancialContractDto,
        company: { connect: { id: companyId } },
      },
    });
  }

  async findAll() {
    const query = await this.qb.query('financialContract');
    const financialContracts = await this.prisma.financialContract.findMany(
      query,
    );
    return financialContracts;
  }

  async findOne(id: string) {
    const query = await this.qb.query('financialContract');
    const financialContract = await this.prisma.financialContract.findFirst({
      ...query,
      where: { id },
    });

    if (!financialContract) {
      throw new BadRequestException('Contrato não encontrado');
    }

    return financialContract;
  }

  async update(
    id: string,
    updateFinancialContractDto: UpdateFinancialContractDto,
  ) {
    const financialContract = await this.prisma.financialContract.findFirst({
      where: { id },
    });

    if (!financialContract) {
      throw new BadRequestException('Contrato não encontrado');
    }

    return this.prisma.financialContract.update({
      where: { id },
      data: updateFinancialContractDto,
    });
  }

  async remove(id: string) {
    const financialContract = await this.prisma.financialContract.findFirst({
      where: { id },
    });

    if (!financialContract) {
      throw new BadRequestException('Contrato não encontrado');
    }

    return this.prisma.financialContract.delete({
      where: { id },
    });
  }
}
