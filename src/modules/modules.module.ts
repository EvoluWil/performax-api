import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { TaskTypeModule } from './task-type/task-type.module';
import { EmployeeModule } from './employee/employee.module';
import { EmployeeClockModule } from './employee-clock/employee-clock.module';

@Module({
  imports: [UserModule, TaskModule, ClientModule, TaskTypeModule, EmployeeModule, EmployeeClockModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
