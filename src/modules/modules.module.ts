import { Module } from '@nestjs/common';
import { ChangelogModule } from './changelog/changelog.module';
import { CompanyModule } from './company/company.module';
import { ModuleModule } from './module/module.module';

@Module({
  imports: [CompanyModule, ModuleModule, ChangelogModule],
  providers: [],
  exports: [],
})
export class ModulesModule {}
