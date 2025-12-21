import { PartialType } from '@nestjs/mapped-types';
import { BudgetStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateBudgetDto } from './create-budget.dto';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
  @IsString()
  @IsEnum(BudgetStatusEnum)
  @IsOptional()
  status: BudgetStatusEnum;
}
