import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateFinancialTransferDto } from './dto/create-financial-transfer.dto';
import { UpdateFinancialTransferDto } from './dto/update-financial-transfer.dto';
import { FinancialTransferService } from './financial-transfer.service';

@Controller('financial-transfer')
export class FinancialTransferController {
  constructor(
    private readonly financialTransferService: FinancialTransferService,
  ) {}

  @Post()
  create(@Body() createFinancialTransferDto: CreateFinancialTransferDto) {
    return this.financialTransferService.create(createFinancialTransferDto);
  }

  @Get()
  findAll() {
    return this.financialTransferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialTransferService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinancialTransferDto: UpdateFinancialTransferDto,
  ) {
    return this.financialTransferService.update(id, updateFinancialTransferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialTransferService.remove(id);
  }
}
