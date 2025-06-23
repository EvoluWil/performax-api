import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionService } from './permission.service';

@Controller('companies/:companyId/roles/:roleId/permissions')
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
  remove(
    @Param('permissionId') permissionId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.permissionService.remove(permissionId, roleId);
  }
}
