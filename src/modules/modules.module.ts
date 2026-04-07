import { Module } from '@nestjs/common';
import { ChangelogModule } from './changelog/changelog.module';
import { CompanyGroupModule } from './company-group/company-group.module';
import { CompanyModule } from './company/company.module';
import { ModuleModule } from './module/module.module';

@Module({
  imports: [CompanyModule, ModuleModule, ChangelogModule, CompanyGroupModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
