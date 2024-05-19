import { Module } from '@nestjs/common';
import { BudgetTypeModule } from './budget-type/budget-type.module';
import { BudgetModule } from './budget/budget.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ClientModule } from './client/client.module';
import { EmployeeClockModule } from './employee-clock/employee-clock.module';
import { EmployeeDayModule } from './employee-day/employee-day.module';
import { EmployeeModule } from './employee/employee.module';
import { EntryTypeModule } from './entry-types/entry-type.module';
import { EntryModule } from './entry/entry.module';
import { OccurrenceModule } from './occurrence/occurrence.module';
import { TaskTypeModule } from './task-type/task-type.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    TaskModule,
    ClientModule,
    TaskTypeModule,
    EntryTypeModule,
    EmployeeModule,
    EmployeeClockModule,
    EmployeeDayModule,
    EntryModule,
    ChecklistModule,
    BudgetModule,
    BudgetTypeModule,
    OccurrenceModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
