import { Body, Controller, Get, Put } from '@nestjs/common';
import { UpdateFinancialBalanceDto } from './dto/update-financial-balance.dto';
import { FinancialBalanceService } from './financial-balance.service';

@Controller('financial-balance')
export class FinancialBalanceController {
  constructor(
    private readonly financialBalanceService: FinancialBalanceService,
  ) {}

  @Get()
  findOne() {
    return this.financialBalanceService.findOne('670a603c58afadf55dc9bd67');
  }

  @Put()
  update(@Body() updateFinancialBalanceDto: UpdateFinancialBalanceDto) {
    return this.financialBalanceService.update(
      '670a603c58afadf55dc9bd67',
      updateFinancialBalanceDto,
    );
  }
}
