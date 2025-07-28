import { Module } from '@nestjs/common';
import { TaskController } from './index/task.controller';
import { TaskService } from './index/task.service';
import { TypeModule } from './type/type.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TypeModule],
})
export class TaskModule {}
