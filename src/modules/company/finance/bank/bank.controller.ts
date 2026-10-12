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
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Controller('companies/:companyId/finance-banks')
@RequirePermission('financial', 'WRITE')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  create(
    @Body() createBankDto: CreateBankDto,
    @Param('companyId') companyId: string,
  ) {
    return this.bankService.create(createBankDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.bankService.findAll(companyId);
  }

  @Put(':bankId')
  update(
    @Param('bankId') bankId: string,
    @Param('companyId') companyId: string,
    @Body() updateBankDto: UpdateBankDto,
  ) {
    return this.bankService.update(bankId, companyId, updateBankDto);
  }

  @Delete(':bankId')
  @RequirePermission('financial', 'ADMIN')
  remove(
    @Param('bankId') bankId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.bankService.remove(bankId, companyId);
  }
}
