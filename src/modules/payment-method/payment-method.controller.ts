import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodService } from './payment-method.service';

@Controller('companies/:companyId/payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  create(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
    @Param('companyId') companyId: string,
  ) {
    return this.paymentMethodService.create(createPaymentMethodDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.paymentMethodService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodService.update(id, updatePaymentMethodDto);
  }
}
