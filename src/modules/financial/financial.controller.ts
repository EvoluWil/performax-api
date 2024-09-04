import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CreateFinancialDto } from './dto/create-financial.dto';
import { UpdateFinancialDto } from './dto/update-financial.dto';
import { FinancialService } from './financial.service';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post()
  create(
    @Body() createFinancialDto: CreateFinancialDto,
    @AuthUser() authUser: Request['user'],
  ) {
    return this.financialService.create(createFinancialDto, authUser?.id);
  }

  @Get()
  findAll() {
    return this.financialService.findAll();
  }

  @Get('options/data')
  findData() {
    return this.financialService.findData();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinancialDto: UpdateFinancialDto,
  ) {
    return this.financialService.update(id, updateFinancialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialService.remove(id);
  }
}
