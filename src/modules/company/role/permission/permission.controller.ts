import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionService } from './permission.service';

@Controller('companies/:companyId/roles/:roleId/permissions')
@RequirePermission('role', 'WRITE')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(
    @Param('roleId') roleId: string,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    return this.permissionService.create(roleId, createPermissionDto);
  }

  @Delete(':permissionId')
  @RequirePermission('role', 'ADMIN')
  remove(
    @Param('permissionId') permissionId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.permissionService.remove(permissionId, roleId);
  }
}
