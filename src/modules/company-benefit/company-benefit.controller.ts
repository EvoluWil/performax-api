import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CompanyBenefitService } from './company-benefit.service';
import { CreateCompanyBenefitDto } from './dto/create-company-benefit.dto';
import { UpdateCompanyBenefitDto } from './dto/update-company-benefit.dto';

@Controller('companies/:companyId/company-benefits')
export class CompanyBenefitController {
  constructor(private readonly companyBenefitService: CompanyBenefitService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body()
    createCompanyBenefitDto: CreateCompanyBenefitDto,
  ) {
    return this.companyBenefitService.create(
      companyId,
      createCompanyBenefitDto,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyBenefitDto: UpdateCompanyBenefitDto,
  ) {
    return this.companyBenefitService.update(id, updateCompanyBenefitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyBenefitService.remove(id);
  }
}
