import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { TaskTypeModule } from './task-type/task-type.module';

@Module({
  imports: [UserModule, TaskModule, ClientModule, TaskTypeModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
