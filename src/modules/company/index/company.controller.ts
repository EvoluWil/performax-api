import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @AuthUser() user: User) {
    return this.companyService.create(createCompanyDto, user.id);
  }

  @Get()
  findAll(@AuthUser() user: User) {
    return this.companyService.findAll(user.id);
  }

  @Get(':companyId')
  findOne(@Param('companyId') companyId: string, @AuthUser() user: User) {
    return this.companyService.findOne(companyId, user.id);
  }

  @Put(':companyId')
  update(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(companyId, user.id, updateCompanyDto);
  }

  @Delete(':companyId')
  remove(@Param('companyId') companyId: string, @AuthUser() user: User) {
    return this.companyService.remove(companyId, user.id);
  }
}
