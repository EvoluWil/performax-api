import { Module } from '@nestjs/common';
import { BudgetController } from './index/budget.controller';
import { BudgetService } from './index/budget.service';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
