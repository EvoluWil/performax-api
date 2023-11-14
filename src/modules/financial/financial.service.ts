import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFinancialDto } from './dto/create-financial.dto';
import { UpdateFinancialDto } from './dto/update-financial.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';

@Injectable()
export class FinancialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  create(createFinancialDto: CreateFinancialDto, companyId: string) {
    const { categoryId, contractId, partnerId, ...body } = createFinancialDto;

    return this.prisma.financial.create({
      data: {
        ...body,
        category: { connect: { id: categoryId } },
        contract: { connect: { id: contractId } },
        partner: { connect: { id: partnerId } },
        company: { connect: { id: companyId } },
      },
    });
  }

  async findAll(companyId: string) {
    const query = await this.qb.query('financial');
    const financies = await this.prisma.financial.findMany({
      ...query,
      where: { ...query.where, companyId },
    });
    return financies;
  }

  async findOne(id: string) {
    const query = await this.qb.query('financial');
    const finance = await this.prisma.financial.findFirst({
      ...query,
      where: { id },
    });

    if (!finance) {
      throw new BadRequestException('Finança não encontrada');
    }

    return finance;
  }

  async update(id: string, updateFinancialDto: UpdateFinancialDto) {
    const finance = await this.prisma.financial.findFirst({
      where: { id },
    });

    if (!finance) {
      throw new BadRequestException('Finança não encontrada');
    }

    return this.prisma.financial.update({
      where: { id },
      data: updateFinancialDto,
    });
  }

  async remove(id: string) {
    const finance = await this.prisma.financial.findFirst({
      where: { id },
    });

    if (!finance) {
      throw new BadRequestException('Finança não encontrada');
    }

    return this.prisma.financial.delete({
      where: { id },
    });
  }
}
