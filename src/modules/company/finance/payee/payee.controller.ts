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
import { CreatePayeeDto } from './dto/create-payee.dto';
import { UpdatePayeeDto } from './dto/update-payee.dto';
import { PayeeService } from './payee.service';

@Controller('companies/:companyId/finance-payees')
@RequirePermission('financial', 'WRITE')
export class PayeeController {
  constructor(private readonly payeeService: PayeeService) {}

  @Post()
  create(
    @Body() createPayeeDto: CreatePayeeDto,
    @Param('companyId') companyId: string,
  ) {
    return this.payeeService.create(createPayeeDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.payeeService.findAll(companyId);
  }

  @Put(':payeeId')
  update(
    @Param('payeeId') payeeId: string,
    @Param('companyId') companyId: string,
    @Body() updatePayeeDto: UpdatePayeeDto,
  ) {
    return this.payeeService.update(payeeId, companyId, updatePayeeDto);
  }

  @Delete(':payeeId')
  @RequirePermission('financial', 'ADMIN')
  remove(
    @Param('payeeId') payeeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.payeeService.remove(payeeId, companyId);
  }
}
