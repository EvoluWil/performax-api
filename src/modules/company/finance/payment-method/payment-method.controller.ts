import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodService } from './payment-method.service';

@Controller('companies/:companyId/finance-payment-methods')
@RequirePermission('financial', 'WRITE')
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

  @Put(':paymentMethodId')
  update(
    @Param('paymentMethodId') paymentMethodId: string,
    @Param('companyId') companyId: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodService.update(
      paymentMethodId,
      companyId,
      updatePaymentMethodDto,
    );
  }

  @Delete(':paymentMethodId')
  @RequirePermission('financial', 'ADMIN')
  remove(
    @Param('paymentMethodId') paymentMethodId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.paymentMethodService.remove(paymentMethodId, companyId);
  }
}
