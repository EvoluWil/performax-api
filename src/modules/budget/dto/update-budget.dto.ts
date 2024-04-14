import { BudgetStatusEnum } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateBudgetDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  value: string;

  @IsBoolean()
  @IsOptional()
  confirmed: boolean;

  @IsEnum(BudgetStatusEnum)
  @IsOptional()
  status: BudgetStatusEnum;

  @IsDateString()
  @IsOptional()
  visitedAt: Date;

  @IsString()
  @IsOptional()
  items: string;
}
