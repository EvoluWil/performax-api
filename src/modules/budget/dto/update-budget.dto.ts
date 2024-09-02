import { BudgetItem, BudgetStatusEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BudgetItemDto } from './budget-item.dto';

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

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => BudgetItemDto)
  @ValidateNested({ each: true })
  items: BudgetItem[];

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
