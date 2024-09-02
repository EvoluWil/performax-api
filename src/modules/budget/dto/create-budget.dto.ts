import { BudgetItem } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BudgetItemDto } from './budget-item.dto';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  @IsMongoId()
  typeId: string;

  @IsOptional()
  @IsMongoId()
  clientId: string;

  @IsOptional()
  @IsMongoId()
  taskId: string;

  @IsOptional()
  @IsMongoId()
  closeTaskId: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @Type(() => BudgetItemDto)
  @ValidateNested({ each: true })
  items: BudgetItem[];

  @IsString()
  @IsOptional()
  observation: string;

  @IsOptional()
  @IsMongoId()
  responsibleId: string;
}
