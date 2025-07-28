import { Module } from '@nestjs/common';
import { RoleController } from './index/role.controller';
import { RoleService } from './index/role.service';
import { PermissionModule } from './permission/permission.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [PermissionModule],
})
export class RoleModule {}
