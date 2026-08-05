import { Global, Module } from '@nestjs/common';
import { CompanyPermissionService } from './company-permission.service';

@Global()
@Module({
  providers: [CompanyPermissionService],
  exports: [CompanyPermissionService],
})
export class PermissionModule {}
