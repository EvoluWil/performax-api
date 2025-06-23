import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PermissionModule } from './permission/permission.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [PermissionModule],
})
export class RoleModule {}
