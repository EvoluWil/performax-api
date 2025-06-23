import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService {
  constructor(private readonly prisma: PrismaService) {}
  create(createBankDto: CreateBankDto, companyId: string) {
    return this.prisma.companyFinanceBank.create({
      data: {
        ...createBankDto,
        company: {
          connect: { id: companyId },
        },
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.companyFinanceBank.findMany({
      where: { companyId, deleted: false },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(bankId: string, companyId: string) {
    const bank = await this.prisma.companyFinanceBank.findFirst({
      where: { id: bankId, companyId, deleted: false },
    });

    if (!bank) {
      throw new NotFoundException('Banco não encontrado');
    }

    return bank;
  }

  async update(
    bankId: string,
    companyId: string,
    updateBankDto: UpdateBankDto,
  ) {
    await this.findOne(bankId, companyId);

    return this.prisma.companyFinanceBank.update({
      where: { id: bankId },
      data: updateBankDto,
    });
  }

  async remove(bankId: string, companyId: string) {
    await this.findOne(bankId, companyId);

    return this.prisma.companyFinanceBank.update({
      where: { id: bankId },
      data: { deleted: true },
    });
  }
}
