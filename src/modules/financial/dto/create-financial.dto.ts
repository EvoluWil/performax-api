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
  @IsOptional()
  retention: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  paymentDate: Date;

  @IsString()
  @IsOptional()
  observation: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(FinancialFlowEnum)
  flow: FinancialFlowEnum;

  @IsOptional()
  @IsMongoId()
  typeId: string;

  @IsMongoId()
  @IsOptional()
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
  @IsOptional()
  categoryId: string;

  @IsMongoId()
  @IsOptional()
  favoredId: string;

  @IsMongoId()
  @IsOptional()
  employeeId: string;

  @IsMongoId()
  @IsOptional()
  companyInId: string;

  @IsBoolean()
  @IsOptional()
  isRecurring: boolean;

  @IsString()
  @IsDateString()
  @IsOptional()
  recurringEndDate: Date;
}
