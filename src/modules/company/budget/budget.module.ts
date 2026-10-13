import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { BudgetController } from './index/budget.controller';
import { BudgetService } from './index/budget.service';
import { TypeModule } from './type/type.module';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService],
  imports: [TypeModule, NotificationModule],
})
export class BudgetModule {}
