import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BudgetTypeService } from './budget-type.service';
import { CreateBudgetTypeDto } from './dto/create-budget-type.dto';
import { UpdateBudgetTypeDto } from './dto/update-budget-type.dto';

@Controller('companies/:companyId/budget-types')
export class BudgetTypeController {
  constructor(private readonly budgetTypeService: BudgetTypeService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createBudgetTypeDto: CreateBudgetTypeDto,
  ) {
    return this.budgetTypeService.create(companyId, createBudgetTypeDto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.budgetTypeService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetTypeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBudgetTypeDto: UpdateBudgetTypeDto,
  ) {
    return this.budgetTypeService.update(id, updateBudgetTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetTypeService.remove(id);
  }
}
