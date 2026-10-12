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
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('companies/:companyId/budgets')
@RequirePermission('budget', 'READ')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  @RequirePermission('budget', 'WRITE')
  create(
    @Body() createBudgetDto: CreateBudgetDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.budgetService.create(createBudgetDto, companyId, user.id);
  }

  @Get()
  findAll(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.budgetService.findAll(companyId, user.id);
  }

  @Get(':budgetId')
  findOne(
    @Param('budgetId') budgetId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.budgetService.findOne(budgetId, companyId);
  }

  @Put(':budgetId')
  @RequirePermission('budget', 'WRITE')
  update(
    @Param('budgetId') budgetId: string,
    @Param('companyId') companyId: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetService.update(budgetId, companyId, updateBudgetDto);
  }

  @Put(':budgetId/approve')
  @RequirePermission('budget', 'ADMIN')
  approve(
    @Param('budgetId') budgetId: string,
    @Param('companyId') companyId: string,
    @Body('approved') approved: boolean,
  ) {
    return this.budgetService.approve(budgetId, companyId, approved);
  }

  @Delete(':budgetId')
  @RequirePermission('budget', 'ADMIN')
  remove(
    @Param('budgetId') budgetId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.budgetService.remove(budgetId, companyId);
  }
}
