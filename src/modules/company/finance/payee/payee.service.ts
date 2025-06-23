import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';

@Injectable()
export class PayeeService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPayeeDto: CreatePayeeDto, companyId: string) {
    return this.prisma.companyFinancePayee.create({
      data: {
        ...createPayeeDto,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.companyFinancePayee.findMany({
      where: {
        companyId: companyId,
        deleted: false,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(payeeId: string, companyId: string) {
    const payee = await this.prisma.companyFinancePayee.findFirst({
      where: {
        id: payeeId,
        companyId: companyId,
        deleted: false,
      },
    });

    if (!payee) {
      throw new NotFoundException('Favorecido não encontrado');
    }

    return payee;
  }

  async update(
    payeeId: string,
    companyId: string,
    updatePayeeDto: UpdatePayeeDto,
  ) {
    await this.findOne(payeeId, companyId);

    return this.prisma.companyFinancePayee.update({
      where: {
        id: payeeId,
      },
      data: updatePayeeDto,
    });
  }

  async remove(payeeId: string, companyId: string) {
    await this.findOne(payeeId, companyId);

    return this.prisma.companyFinancePayee.update({
      where: {
        id: payeeId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
