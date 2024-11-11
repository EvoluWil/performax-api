import { Module } from '@nestjs/common';
import { BankModule } from './bank/bank.module';
import { BudgetTypeModule } from './budget-type/budget-type.module';
import { BudgetModule } from './budget/budget.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ClientModule } from './client/client.module';
import { CompanyModule } from './company/company.module';
import { EmployeeClockModule } from './employee-clock/employee-clock.module';
import { EmployeeDayModule } from './employee-day/employee-day.module';
import { EmployeeModule } from './employee/employee.module';
import { EntryTypeModule } from './entry-types/entry-type.module';
import { EntryModule } from './entry/entry.module';
import { FinancialTypeModule } from './financial-type/financial-type.module';
import { FinancialModule } from './financial/financial.module';
import { OccurrenceModule } from './occurrence/occurrence.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { RecurringFinancialModule } from './recurring-financial/recurring-financial.module';
import { TaskTypeModule } from './task-type/task-type.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { FinancialCategoryModule } from './financial-category/financial-category.module';
import { FinancialTransferModule } from './financial-transfer/financial-transfer.module';
import { FinancialBalanceModule } from './financial-balance/financial-balance.module';
import { FinancialFavoredModule } from './financial-favored/financial-favored.module';
import { OccurrenceTypeModule } from './occurrence-type/occurrence-type.module';

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
    FinancialModule,
    FinancialTypeModule,
    BankModule,
    PaymentMethodModule,
    RecurringFinancialModule,
    CompanyModule,
    FinancialCategoryModule,
    FinancialTransferModule,
    FinancialBalanceModule,
    FinancialFavoredModule,
    OccurrenceTypeModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
