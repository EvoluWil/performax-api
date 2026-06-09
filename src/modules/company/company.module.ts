import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { ClientModule } from './client/client.module';
import { ContractModule } from './contract/contract.module';
import { EmployeeModule } from './employee/employee.module';
import { EntryModule } from './entry/entry.module';
import { FinanceModule } from './finance/finance.module';
import { FormResourcesModule } from './form-resources/form-resources.module';
import { CompanyController } from './index/company.controller';
import { CompanyService } from './index/company.service';
import { ModuleModule } from './module/module.module';
import { OccurrenceModule } from './occurrence/occurrence.module';
import { RoleModule } from './role/role.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { WhiteLabelModule } from './white-label/white-label.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    FinanceModule,
    TaskModule,
    OccurrenceModule,
    BudgetModule,
    EntryModule,
    ModuleModule,
    ClientModule,
    ContractModule,
    EmployeeModule,
    FormResourcesModule,
    WhiteLabelModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [],
})
export class CompanyModule {}
