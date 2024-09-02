import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { name: createPaymentMethodDto.name },
    });

    if (paymentMethod) {
      throw new BadRequestException('Método de pagamento já cadastrado!');
    }

    return this.prisma.paymentMethod.create({
      data: createPaymentMethodDto,
    });
  }

  async findAll() {
    const query = await this.qb.query('paymentMethod');

    return this.prisma.paymentMethod.findMany(query);
  }

  async findOne(id: string) {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id },
    });

    if (!paymentMethod) {
      throw new BadRequestException('Método de pagamento não encontrado!');
    }

    return paymentMethod;
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id },
    });

    if (!paymentMethod) {
      throw new BadRequestException('Método de pagamento não encontrado!');
    }

    return this.prisma.paymentMethod.update({
      where: { id },
      data: updatePaymentMethodDto,
    });
  }
}
