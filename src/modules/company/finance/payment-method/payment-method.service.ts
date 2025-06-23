import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPaymentMethodDto: CreatePaymentMethodDto, companyId: string) {
    return this.prisma.companyFinancePaymentMethod.create({
      data: {
        ...createPaymentMethodDto,
        company: {
          connect: { id: companyId },
        },
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.companyFinancePaymentMethod.findMany({
      where: { companyId, deleted: false },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string, companyId: string) {
    const paymentMethod =
      await this.prisma.companyFinancePaymentMethod.findFirst({
        where: { id, companyId, deleted: false },
      });

    if (!paymentMethod) {
      throw new NotFoundException('Método de pagamento não encontrado');
    }

    return paymentMethod;
  }

  async update(
    id: string,
    companyId: string,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    await this.findOne(id, companyId);

    return this.prisma.companyFinancePaymentMethod.update({
      where: { id },
      data: updatePaymentMethodDto,
    });
  }

  async remove(id: string, companyId: string) {
    await this.findOne(id, companyId);

    return this.prisma.companyFinancePaymentMethod.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
