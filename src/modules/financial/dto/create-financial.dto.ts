import { FinancialRecurrenceTypeEnum, FinancialTypeEnum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFinancialDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsEnum(FinancialTypeEnum)
  @IsNotEmpty()
  type: FinancialTypeEnum;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;

  @IsEnum(FinancialRecurrenceTypeEnum)
  @IsNotEmpty()
  recurrence: FinancialRecurrenceTypeEnum;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  partnerId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  contractId: string;
}
