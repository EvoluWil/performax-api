import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { AdminOnly } from 'src/decorators/admin-only.decorator';
import { CompanyGroupService } from './company-group.service';
import { CreateCompanyGroupDto } from './dto/create-company-group.dto';
import { UpdateCompanyGroupDto } from './dto/update-company-group.dto';

@Controller('company-groups')
export class CompanyGroupController {
  constructor(private readonly companyGroupService: CompanyGroupService) {}

  @AdminOnly()
  @Post()
  create(@Body() createCompanyGroupDto: CreateCompanyGroupDto) {
    return this.companyGroupService.create(createCompanyGroupDto);
  }

  @Get()
  findAll() {
    return this.companyGroupService.findAll();
  }

  @Get(':groupId')
  findOne(@Param('groupId') groupId: string) {
    return this.companyGroupService.findOne(groupId);
  }

  @Get(':groupId/companies')
  getCompanies(@Param('groupId') groupId: string) {
    return this.companyGroupService.getCompanies(groupId);
  }

  @AdminOnly()
  @Put(':groupId')
  update(
    @Param('groupId') groupId: string,
    @Body() updateCompanyGroupDto: UpdateCompanyGroupDto,
  ) {
    return this.companyGroupService.update(groupId, updateCompanyGroupDto);
  }

  @AdminOnly()
  @Delete(':groupId')
  remove(@Param('groupId') groupId: string) {
    return this.companyGroupService.remove(groupId);
  }

  @AdminOnly()
  @Patch('companies/:companyId/group')
  assignGroup(
    @Param('companyId') companyId: string,
    @Body('groupId') groupId: string | null,
  ) {
    return this.companyGroupService.assignGroup(companyId, groupId);
  }
}
