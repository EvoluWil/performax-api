import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateFinancialFavoredDto } from './dto/create-financial-favored.dto';
import { UpdateFinancialFavoredDto } from './dto/update-financial-favored.dto';
import { FinancialFavoredService } from './financial-favored.service';

@Controller('financial-favored')
export class FinancialFavoredController {
  constructor(
    private readonly financialFavoredService: FinancialFavoredService,
  ) {}

  @Post()
  create(@Body() createFinancialFavoredDto: CreateFinancialFavoredDto) {
    return this.financialFavoredService.create(createFinancialFavoredDto);
  }

  @Get()
  findAll() {
    return this.financialFavoredService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialFavoredService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinancialFavoredDto: UpdateFinancialFavoredDto,
  ) {
    return this.financialFavoredService.update(id, updateFinancialFavoredDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialFavoredService.remove(id);
  }
}
