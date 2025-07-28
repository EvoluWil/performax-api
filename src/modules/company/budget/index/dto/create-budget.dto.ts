import { BudgetItem } from '@prisma/client';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsNumber()
  @IsOptional()
  value: number;

  @IsMongoId()
  @IsNotEmpty()
  typeId: string;

  @IsMongoId()
  @IsOptional()
  clientId: string;

  @IsMongoId()
  @IsOptional()
  responsibleId: string;

  @IsArray()
  @IsOptional()
  items: BudgetItem[];
}
