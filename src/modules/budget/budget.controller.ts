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
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('companies/:companyId/budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createBudgetDto: CreateBudgetDto,
    @AuthUser() authUser: Request['user'],
  ) {
    return this.budgetService.create(companyId, createBudgetDto, authUser?.id);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.budgetService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetService.remove(id);
  }
}
