import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FinanceFlowEnum, FinanceStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWallet(companyId: string) {
    const wallet = await this.prisma.companyFinanceWallet.findFirst({
      where: { companyId },
    });

    if (wallet) return wallet;

    return this.prisma.companyFinanceWallet.create({
      data: { company: { connect: { id: companyId } } },
    });
  }

  async recalculate(companyId: string) {
    const paid = await this.prisma.companyFinance.findMany({
      where: { companyId, status: FinanceStatusEnum.PAID, deleted: false },
      select: { flow: true, value: true, tax: true, retention: true },
    });

    const totalIn = paid
      .filter((f) => f.flow === FinanceFlowEnum.IN)
      .reduce((sum, f) => sum + f.value - f.tax - f.retention, 0);

    const totalOut = paid
      .filter(
        (f) =>
          f.flow === FinanceFlowEnum.OUT || f.flow === FinanceFlowEnum.TRANSFER,
      )
      .reduce((sum, f) => sum + f.value + f.tax + f.retention, 0);

    const amount = totalIn - totalOut;

    const existing = await this.prisma.companyFinanceWallet.findFirst({
      where: { companyId },
    });

    if (existing) {
      return this.prisma.companyFinanceWallet.update({
        where: { id: existing.id },
        data: { amount: amount + (existing.initialValue ?? 0) },
      });
    }

    return this.prisma.companyFinanceWallet.create({
      data: { amount, company: { connect: { id: companyId } } },
    });
  }

  async create(createWalletDto: CreateWalletDto, companyId: string) {
    const alreadyExists = await this.prisma.companyFinanceWallet.findFirst({
      where: {
        companyId,
      },
    });

    if (alreadyExists) {
      throw new ConflictException('Já existe uma carteira para esta empresa');
    }

    return this.prisma.companyFinanceWallet.create({
      data: {
        ...createWalletDto,
        company: {
          connect: { id: companyId },
        },
      },
    });
  }

  async update(
    updateWalletDto: UpdateWalletDto,
    walletId: string,
    companyId: string,
  ) {
    const wallet = await this.prisma.companyFinanceWallet.findFirst({
      where: {
        id: walletId,
        companyId,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada');
    }

    return this.prisma.companyFinanceWallet.update({
      where: { id: walletId },
      data: updateWalletDto,
    });
  }
}
