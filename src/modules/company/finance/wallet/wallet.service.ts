import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}
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
