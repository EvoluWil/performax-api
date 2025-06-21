import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateFinancialTypeDto } from './dto/create-financial-type.dto';
import { UpdateFinancialTypeDto } from './dto/update-financial-type.dto';
import { FinancialTypeService } from './financial-type.service';

@Controller('companies/:companyId/financial-types')
export class FinancialTypeController {
  constructor(private readonly financialTypeService: FinancialTypeService) {}

  @Post()
  create(
    @Body() createFinancialTypeDto: CreateFinancialTypeDto,
    @Param('companyId') companyId: string,
  ) {
    return this.financialTypeService.create(createFinancialTypeDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.financialTypeService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialTypeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinancialTypeDto: UpdateFinancialTypeDto,
  ) {
    return this.financialTypeService.update(id, updateFinancialTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialTypeService.remove(id);
  }
}
