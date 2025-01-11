import { Module } from '@nestjs/common';
import { CompanyBalanceController } from './company-balance.controller';
import { CompanyBalanceService } from './company-balance.service';

@Module({
  controllers: [CompanyBalanceController],
  providers: [CompanyBalanceService],
})
export class CompanyBalanceModule {}
