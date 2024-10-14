import { Module } from '@nestjs/common';
import { FinancialBalanceService } from './financial-balance.service';
import { FinancialBalanceController } from './financial-balance.controller';

@Module({
  controllers: [FinancialBalanceController],
  providers: [FinancialBalanceService],
})
export class FinancialBalanceModule {}
