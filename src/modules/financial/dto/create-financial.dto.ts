import { FinancialFlowEnum } from '@prisma/client';
import {
  IsBoolean,
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
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsOptional()
  tax: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  paymentData: Date;

  @IsString()
  @IsOptional()
  observation: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(FinancialFlowEnum)
  flow: FinancialFlowEnum;

  @IsNotEmpty()
  @IsMongoId()
  typeId: string;

  @IsMongoId()
  @IsNotEmpty()
  clientId: string;

  @IsMongoId()
  @IsNotEmpty()
  methodId: string;

  @IsMongoId()
  @IsNotEmpty()
  bankId: string;

  @IsMongoId()
  @IsNotEmpty()
  companyId: string;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  isRecurring: boolean;

  @IsString()
  @IsDateString()
  @IsOptional()
  recurringEndDate: Date;
}
