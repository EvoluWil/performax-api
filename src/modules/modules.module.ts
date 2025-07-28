import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { ModuleModule } from './module/module.module';

@Module({
  imports: [CompanyModule, ModuleModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
