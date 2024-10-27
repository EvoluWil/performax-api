import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateFinancialFavoredDto } from './dto/create-financial-favored.dto';
import { UpdateFinancialFavoredDto } from './dto/update-financial-favored.dto';

@Injectable()
export class FinancialFavoredService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFinancialFavoredDto: CreateFinancialFavoredDto) {
    await this.prisma.financialFavored.create({
      data: createFinancialFavoredDto,
    });

    return { ok: true };
  }

  async findAll() {
    return await this.prisma.financialFavored.findMany();
  }

  async findOne(id: string) {
    const financialFavored = await this.prisma.financialFavored.findFirst({
      where: { id },
    });

    if (!financialFavored) {
      throw new BadRequestException('Favorecido não encontrado!');
    }

    return financialFavored;
  }

  async update(
    id: string,
    updateFinancialFavoredDto: UpdateFinancialFavoredDto,
  ) {
    const financialFavored = await this.prisma.financialFavored.findFirst({
      where: { id },
    });

    if (!financialFavored) {
      throw new BadRequestException('Favorecido não encontrado!');
    }

    await this.prisma.financialFavored.update({
      where: { id },
      data: updateFinancialFavoredDto,
    });

    return { ok: true };
  }

  async remove(id: string) {
    const financialFavored = await this.prisma.financialFavored.findFirst({
      where: { id },
    });

    if (!financialFavored) {
      throw new BadRequestException('Favorecido não encontrado!');
    }

    await this.prisma.financialFavored.delete({
      where: { id },
    });

    return { ok: true };
  }
}
