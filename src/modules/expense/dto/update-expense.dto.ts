import { PartialType } from '@nestjs/mapped-types';
import { ExpenseStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @IsString()
  @IsOptional()
  @IsEnum(ExpenseStatusEnum)
  status: ExpenseStatusEnum;
}
