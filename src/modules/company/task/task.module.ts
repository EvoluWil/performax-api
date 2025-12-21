import { Module } from '@nestjs/common';
import { ChecklistModule } from './checklist/checklist.module';
import { TaskController } from './index/task.controller';
import { TaskService } from './index/task.service';
import { RecurringModule } from './recurring/recurring.module';
import { TypeModule } from './type/type.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TypeModule, ChecklistModule, RecurringModule],
})
export class TaskModule {}
