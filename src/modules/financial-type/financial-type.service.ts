import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateFinancialTypeDto } from './dto/create-financial-type.dto';
import { UpdateFinancialTypeDto } from './dto/update-financial-type.dto';

@Injectable()
export class FinancialTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(
    createFinancialTypeDto: CreateFinancialTypeDto,
    companyId: string,
  ) {
    const financialType = await this.prisma.financialType.findFirst({
      where: { name: createFinancialTypeDto.name, companyId },
    });

    if (financialType) {
      throw new BadRequestException('Tipo de despesa já cadastrada!');
    }

    return this.prisma.financialType.create({
      data: {
        ...createFinancialTypeDto,
        needApprove: createFinancialTypeDto.needApprove || false,
        company: { connect: { id: companyId } },
      },
    });
  }

  async findAll(companyId: string) {
    const query = await this.qb.query('financialType');

    return this.prisma.financialType.findMany({
      ...query,
      where: { companyId },
    });
  }

  async findOne(id: string) {
    const financialType = await this.prisma.financialType.findFirst({
      where: { id },
    });

    if (!financialType) {
      throw new BadRequestException('Tipo de despesa não encontrada!');
    }

    return financialType;
  }

  async update(id: string, updateFinancialTypeDto: UpdateFinancialTypeDto) {
    const financialType = await this.prisma.financialType.findFirst({
      where: { id },
    });

    if (!financialType) {
      throw new BadRequestException('Tipo de despesa não encontrada!');
    }

    return this.prisma.financialType.update({
      where: { id },
      data: {
        ...updateFinancialTypeDto,
        needApprove: updateFinancialTypeDto.needApprove || false,
      },
    });
  }

  async remove(id: string) {
    const financialType = await this.prisma.financialType.findFirst({
      where: { id },
    });

    if (!financialType) {
      throw new BadRequestException('Tipo de despesa não encontrada!');
    }

    return this.prisma.financialType.delete({
      where: { id },
    });
  }
}
