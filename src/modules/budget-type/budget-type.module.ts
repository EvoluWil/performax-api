import { Module } from '@nestjs/common';
import { BudgetTypeController } from './budget-type.controller';
import { BudgetTypeService } from './budget-type.service';

@Module({
  controllers: [BudgetTypeController],
  providers: [BudgetTypeService],
})
export class BudgetTypeModule {}
