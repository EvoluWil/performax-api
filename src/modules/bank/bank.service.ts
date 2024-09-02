import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createBankDto: CreateBankDto) {
    const bank = await this.prisma.bank.findFirst({
      where: { name: createBankDto.name },
    });

    if (bank) {
      throw new BadRequestException('Banco já cadastrado!');
    }

    return this.prisma.bank.create({
      data: createBankDto,
    });
  }

  async findAll() {
    const query = await this.qb.query('bank');

    return this.prisma.bank.findMany(query);
  }

  async findOne(id: string) {
    const bank = await this.prisma.bank.findFirst({
      where: { id },
    });

    if (!bank) {
      throw new BadRequestException('Banco não encontrado!');
    }

    return bank;
  }

  async update(id: string, updateBankDto: UpdateBankDto) {
    const bank = await this.prisma.bank.findFirst({
      where: { id },
    });

    if (!bank) {
      throw new BadRequestException('Banco não encontrado!');
    }

    return this.prisma.bank.update({
      where: { id },
      data: updateBankDto,
    });
  }
}
