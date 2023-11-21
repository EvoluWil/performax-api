import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CompanyRoleService } from './company-role.service';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto';

@Controller('companies/:companyId')
export class CompanyRoleController {
  constructor(private readonly companyRoleService: CompanyRoleService) {}

  @Post('roles')
  create(@Body() createRoleDto: CreateCompanyRoleDto) {
    return this.companyRoleService.create(createRoleDto);
  }

  @Get('sectors/:sectorId/roles')
  findBySector(@Param('sectorId') sectorId: string) {
    return this.companyRoleService.findAll(sectorId);
  }

  @Put('roles/:roleId')
  update(
    @Param('roleId') roleId: string,
    @Body() updateCompanyRoleDto: UpdateCompanyRoleDto,
  ) {
    return this.companyRoleService.update(roleId, updateCompanyRoleDto);
  }

  @Delete('roles/:roleId')
  remove(@Param('roleId') roleId: string) {
    return this.companyRoleService.remove(roleId);
  }
}
