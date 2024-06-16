import { BudgetStatusEnum } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
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

  @IsOptional()
  @IsMongoId()
  typeId: string;

  @IsOptional()
  @IsMongoId()
  clientId: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsOptional()
  @IsMongoId()
  responsibleId: string;
}
