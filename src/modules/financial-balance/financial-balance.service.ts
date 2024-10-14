import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateFinancialBalanceDto } from './dto/update-financial-balance.dto';

@Injectable()
export class FinancialBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const balance = await this.prisma.balance.findUnique({
      where: { id },
    });

    if (!balance) {
      throw new BadRequestException('Saldo não encontrado!');
    }

    return balance;
  }

  async update(id: string, data: UpdateFinancialBalanceDto) {
    await this.prisma.financial.update({
      where: { id },
      data,
    });

    return { ok: true };
  }
}
