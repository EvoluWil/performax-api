import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('companies/:companyId/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
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

  @Patch(':roleId')
  update(
    @Param('roleId') roleId: string,
    @Param('companyId') companyId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(roleId, companyId, updateRoleDto);
  }

  @Delete(':roleId')
  remove(
    @Param('roleId') roleId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.roleService.remove(roleId, companyId);
  }
}
