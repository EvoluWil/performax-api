import { Module } from '@nestjs/common';
import { RecurringFinancialService } from './recurring-financial.service';
import { RecurringFinancialController } from './recurring-financial.controller';

@Module({
  controllers: [RecurringFinancialController],
  providers: [RecurringFinancialService],
})
export class RecurringFinancialModule {}
