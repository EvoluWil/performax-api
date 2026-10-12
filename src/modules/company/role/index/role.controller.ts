import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('companies/:companyId/roles')
@RequirePermission('role', 'READ')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequirePermission('role', 'WRITE')
  create(
    @Param('companyId') companyId: string,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.roleService.create(createRoleDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.roleService.findAll(companyId);
  }

  @Get(':roleId')
  findOne(
    @Param('roleId') roleId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.roleService.findOne(roleId, companyId);
  }

  @Put(':roleId')
  @RequirePermission('role', 'WRITE')
  update(
    @Param('roleId') roleId: string,
    @Param('companyId') companyId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(roleId, companyId, updateRoleDto);
  }

  @Delete(':roleId')
  @RequirePermission('role', 'ADMIN')
  remove(
    @Param('roleId') roleId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.roleService.remove(roleId, companyId);
  }
}
