import { Module } from '@nestjs/common';
import { BudgetController } from './index/budget.controller';
import { BudgetService } from './index/budget.service';
import { TypeModule } from './type/type.module';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService],
  imports: [TypeModule],
})
export class BudgetModule {}
