import { FinanceFlowEnum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRecurringDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  observation?: string;

  @IsInt()
  @IsNotEmpty()
  value: number;

  @IsInt()
  @IsOptional()
  tax?: number;

  @IsInt()
  @IsOptional()
  retention?: number;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsEnum(FinanceFlowEnum)
  flow: FinanceFlowEnum;

  @IsString()
  @IsOptional()
  recurrence?: string;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsMongoId()
  @IsOptional()
  typeId?: string;

  @IsMongoId()
  @IsOptional()
  bankId?: string;

  @IsMongoId()
  @IsOptional()
  methodId?: string;

  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @IsMongoId()
  @IsOptional()
  segmentId?: string;

  @IsMongoId()
  @IsOptional()
  payeeId?: string;

  @IsMongoId()
  @IsOptional()
  clientId?: string;
}
