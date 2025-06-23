import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @AuthUser() authUser: Request['user'],
  ) {
    return this.companyService.create(createCompanyDto, authUser?.id);
  }

  @Get()
  findAll(@AuthUser() authUser: Request['user']) {
    return this.companyService.findAll(authUser?.id);
  }

  @Get(':companyId')
  findOne(
    @Param('companyId') companyId: string,
    @AuthUser() authUser: Request['user'],
  ) {
    return this.companyService.findOne(companyId, authUser?.id);
  }

  @Put(':companyId')
  update(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @AuthUser() authUser: Request['user'],
  ) {
    return this.companyService.update(
      companyId,
      updateCompanyDto,
      authUser?.id,
    );
  }
}
