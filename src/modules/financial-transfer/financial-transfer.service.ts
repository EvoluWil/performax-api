import { Injectable, NotFoundException } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { generateProtocol } from 'src/utils/generate-protocol';
import { CreateFinancialTransferDto } from './dto/create-financial-transfer.dto';
import { UpdateFinancialTransferDto } from './dto/update-financial-transfer.dto';

@Injectable()
export class FinancialTransferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createFinancialTransferDto: CreateFinancialTransferDto) {
    const data = Object.entries(createFinancialTransferDto).reduce(
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
      {} as any,
    );

    await this.prisma.financialTransfer.create({
      data: {
        ...data,
        protocol: generateProtocol(),
      },
    });

    return { ok: true };
  }

  async findAll() {
    const query = await this.qb.query('financial');
    return this.prisma.financial.findMany(query);
  }

  async findOne(id: string) {
    const transfer = await this.prisma.financialTransfer.findFirst({
      where: { id },
    });

    if (!transfer) {
      throw new NotFoundException('Transferência não encontrada!');
    }

    return transfer;
  }

  async update(
    id: string,
    updateFinancialTransferDto: UpdateFinancialTransferDto,
  ) {
    const transfer = await this.prisma.financialTransfer.findFirst({
      where: { id },
    });

    if (!transfer) {
      throw new NotFoundException('Transferência não encontrada!');
    }

    const data = Object.entries(updateFinancialTransferDto).reduce(
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
      {} as any,
    );

    await this.prisma.financialTransfer.update({
      where: { id },
      data,
    });

    return { ok: true };
  }

  async remove(id: string) {
    const transfer = await this.prisma.financialTransfer.findFirst({
      where: { id },
    });

    if (!transfer) {
      throw new NotFoundException('Transferência não encontrada!');
    }

    await this.prisma.financialTransfer.delete({
      where: { id },
    });

    return { ok: true };
  }
}
