import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import {
  AssignUserClientsDto,
  AssignUserRoleDto,
  AssignUserTargetsDto,
} from './dto/company-user-role.dto';
import { RoleService } from './role.service';

@Controller('companies/:companyId/users/:userId/roles')
@RequirePermission('user', 'READ')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getUserRole(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
  ) {
    return this.roleService.getUserRoleInCompany(userId, companyId);
  }

  @Post()
  @RequirePermission('user', 'WRITE')
  assignUserRole(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Body() assignUserRoleDto: AssignUserRoleDto,
  ) {
    const { roleId } = assignUserRoleDto;
    return this.roleService.assignUserRole(userId, companyId, roleId);
  }

  @Delete()
  @RequirePermission('user', 'WRITE')
  removeUserRole(
    @Param('userId') userId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.roleService.removeUserRole(userId, companyId);
  }

  @Post('clients')
  @RequirePermission('user', 'WRITE')
  assignUserClients(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Body() assignUserClientsDto: AssignUserClientsDto,
  ) {
    const { clientIds } = assignUserClientsDto;
    return this.roleService.assignUserClients(userId, companyId, clientIds);
  }

  @Post('targets')
  @RequirePermission('user', 'WRITE')
  assignUserTargets(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Body() assignUserTargetsDto: AssignUserTargetsDto,
  ) {
    const { targetIds } = assignUserTargetsDto;
    return this.roleService.assignUserTargets(userId, companyId, targetIds);
  }
}
