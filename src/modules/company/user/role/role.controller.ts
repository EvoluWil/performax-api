import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import {
  AssignUserClientsDto,
  AssignUserRoleDto,
  AssignUserTargetsDto,
} from './dto/company-user-role.dto';
import { RoleService } from './role.service';

@Controller('companies/:companyId/users/:userId/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  assignUserRole(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Body() assignUserRoleDto: AssignUserRoleDto,
  ) {
    const { roleId } = assignUserRoleDto;
    return this.roleService.assignUserRole(userId, companyId, roleId);
  }

  @Delete()
  removeUserRole(
    @Param('userId') userId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.roleService.removeUserRole(userId, companyId);
  }

  @Post('clients')
  assignUserClients(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Body() assignUserClientsDto: AssignUserClientsDto,
  ) {
    const { clientIds } = assignUserClientsDto;
    return this.roleService.assignUserClients(userId, companyId, clientIds);
  }

  @Post('targets')
  assignUserTargets(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Body() assignUserTargetsDto: AssignUserTargetsDto,
  ) {
    const { targetIds } = assignUserTargetsDto;
    return this.roleService.assignUserTargets(userId, companyId, targetIds);
  }
}
