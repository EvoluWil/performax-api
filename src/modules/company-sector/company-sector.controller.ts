import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CompanySectorService } from './company-sector.service';
import { CreateCompanySectorDto } from './dto/create-company-sector.dto';
import { UpdateCompanySectorDto } from './dto/update-company-sector.dto';

@Controller('companies/:companyId/sectors')
export class CompanySectorController {
  constructor(private readonly companySectorService: CompanySectorService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createCompanySectorDto: CreateCompanySectorDto,
  ) {
    return this.companySectorService.create(companyId, createCompanySectorDto);
  }

  @Put(':sectorId')
  update(
    @Param('companyId') companyId: string,
    @Param('sectorId') sectorId: string,
    @Body() updateCompanySectorDto: UpdateCompanySectorDto,
  ) {
    return this.companySectorService.update(
      companyId,
      sectorId,
      updateCompanySectorDto,
    );
  }

  @Delete(':sectorId')
  remove(@Param('sectorId') sectorId: string) {
    return this.companySectorService.remove(sectorId);
  }
}
