import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CompanyBalanceService } from './company-balance.service';
import { CreateCompanyBalanceDto } from './dto/create-company-balance.dto';
import { UpdateCompanyBalanceDto } from './dto/update-company-balance.dto';

@Controller('companies/:companyId/balance')
export class CompanyBalanceController {
  constructor(private readonly companyBalanceService: CompanyBalanceService) {}

  @Post()
  create(
    @Body() createCompanyBalanceDto: CreateCompanyBalanceDto,
    @Param('companyId') companyId: string,
  ) {
    return this.companyBalanceService.create(
      companyId,
      createCompanyBalanceDto,
    );
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.companyBalanceService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyBalanceService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyBalanceDto: UpdateCompanyBalanceDto,
  ) {
    return this.companyBalanceService.update(id, updateCompanyBalanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyBalanceService.remove(id);
  }
}
