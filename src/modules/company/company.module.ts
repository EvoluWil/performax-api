import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { FinanceModule } from './finance/finance.module';

@Module({
  imports: [UserModule, RoleModule, FinanceModule],
  providers: [],
  exports: [],
})
export class CompanyModule {}
