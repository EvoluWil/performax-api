import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FinancialContractService } from './financial-contract.service';
import { CreateFinancialContractDto } from './dto/create-financial-contract.dto';
import { UpdateFinancialContractDto } from './dto/update-financial-contract.dto';

@Controller('companies/:companyId/financial-contracts')
export class FinancialContractController {
  constructor(
    private readonly financialContractService: FinancialContractService,
  ) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createFinancialContractDto: CreateFinancialContractDto,
  ) {
    return this.financialContractService.create(
      createFinancialContractDto,
      companyId,
    );
  }

  @Get()
  findAll() {
    return this.financialContractService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialContractService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinancialContractDto: UpdateFinancialContractDto,
  ) {
    return this.financialContractService.update(id, updateFinancialContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialContractService.remove(id);
  }
}
