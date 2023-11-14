import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CompanyRoleService } from './company-role.service';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto';

@Controller('companies/:companyId/roles')
export class CompanyRoleController {
  constructor(private readonly companyRoleService: CompanyRoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateCompanyRoleDto) {
    return this.companyRoleService.create(createRoleDto);
  }

  @Put(':roleId')
  update(
    @Param('roleId') roleId: string,
    @Body() updateCompanyRoleDto: UpdateCompanyRoleDto,
  ) {
    return this.companyRoleService.update(roleId, updateCompanyRoleDto);
  }

  @Delete(':roleId')
  remove(@Param('roleId') roleId: string) {
    return this.companyRoleService.remove(roleId);
  }
}
