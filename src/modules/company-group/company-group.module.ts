import { Module } from '@nestjs/common';
import { CompanyGroupController } from './company-group.controller';
import { CompanyGroupService } from './company-group.service';

@Module({
  controllers: [CompanyGroupController],
  providers: [CompanyGroupService],
  exports: [CompanyGroupService],
})
export class CompanyGroupModule {}
