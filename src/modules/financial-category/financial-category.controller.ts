import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateFinancialCategoryDto } from './dto/create-financial-category.dto';
import { UpdateFinancialCategoryDto } from './dto/update-financial-category.dto';
import { FinancialCategoryService } from './financial-category.service';

@Controller('financial-categories')
export class FinancialCategoryController {
  constructor(
    private readonly financialCategoryService: FinancialCategoryService,
  ) {}

  @Post()
  create(@Body() createFinancialCategoryDto: CreateFinancialCategoryDto) {
    return this.financialCategoryService.create(createFinancialCategoryDto);
  }

  @Get()
  findAll() {
    return this.financialCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialCategoryService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinancialCategoryDto: UpdateFinancialCategoryDto,
  ) {
    return this.financialCategoryService.update(id, updateFinancialCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialCategoryService.remove(id);
  }
}
