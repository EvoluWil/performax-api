import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('companies/:companyId/budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(
    @Body() createBudgetDto: CreateBudgetDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.budgetService.create(createBudgetDto, companyId, user.id);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.budgetService.findAll(companyId);
  }

  @Get(':budgetId')
  findOne(
    @Param('budgetId') budgetId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.budgetService.findOne(budgetId, companyId);
  }

  @Put(':budgetId')
  update(
    @Param('budgetId') budgetId: string,
    @Param('companyId') companyId: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetService.update(budgetId, companyId, updateBudgetDto);
  }

  @Delete(':budgetId')
  remove(
    @Param('budgetId') budgetId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.budgetService.remove(budgetId, companyId);
  }
}
