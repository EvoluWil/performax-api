import { Module } from '@nestjs/common';
import { BankModule } from './bank/bank.module';
import { BudgetTypeModule } from './budget-type/budget-type.module';
import { BudgetModule } from './budget/budget.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ClientModule } from './client/client.module';
import { CompanyBalanceModule } from './company-balance/company-balance.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './company/user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { EntryTypeModule } from './entry-types/entry-type.module';
import { EntryModule } from './entry/entry.module';
import { FinancialCategoryModule } from './financial-category/financial-category.module';
import { FinancialFavoredModule } from './financial-favored/financial-favored.module';
import { FinancialTypeModule } from './financial-type/financial-type.module';
import { FinancialModule } from './financial/financial.module';
import { ModuleModule } from './module/module.module';
import { OccurrenceTypeModule } from './occurrence-type/occurrence-type.module';
import { OccurrenceModule } from './occurrence/occurrence.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { RecurringFinancialModule } from './recurring-financial/recurring-financial.module';
import { TaskTypeModule } from './task-type/task-type.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    UserModule,
    TaskModule,
    ClientModule,
    TaskTypeModule,
    EntryTypeModule,
    EmployeeModule,
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
    FinancialFavoredModule,
    OccurrenceTypeModule,
    CompanyBalanceModule,
    ModuleModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
