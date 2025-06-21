import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Controller('companies/:companyId/banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createBankDto: CreateBankDto,
  ) {
    return this.bankService.create(companyId, createBankDto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.bankService.findAll(companyId);
  }

  @Get(':bankId')
  findOne(@Param('bankId') bankId: string) {
    return this.bankService.findOne(bankId);
  }

  @Put(':bankId')
  update(
    @Param('bankId') bankId: string,
    @Body() updateBankDto: UpdateBankDto,
  ) {
    return this.bankService.update(bankId, updateBankDto);
  }
}
