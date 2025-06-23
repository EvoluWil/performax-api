import { FinanceFlowEnum, FinanceStatusEnum } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateFinanceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  @IsNotEmpty()
  value: number;

  @IsInt()
  @IsNotEmpty()
  tax: number;

  @IsInt()
  @IsNotEmpty()
  retention: number;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsDateString()
  @IsOptional()
  paymentDate: Date;

  @IsString()
  @IsOptional()
  observation: string;

  @IsNotEmpty()
  @IsEnum(FinanceStatusEnum)
  status: FinanceStatusEnum;

  @IsNotEmpty()
  @IsEnum(FinanceFlowEnum)
  flow: FinanceFlowEnum;

  @IsMongoId()
  @IsNotEmpty()
  typeId: string;

  @IsMongoId()
  @IsOptional()
  clientId: string;

  @IsMongoId()
  @IsOptional()
  methodId: string;

  @IsMongoId()
  @IsOptional()
  bankId: string;

  @ValidateIf((o) => o.flow === FinanceFlowEnum.TRANSFER)
  @IsMongoId()
  companyInId: string;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @IsMongoId()
  @IsOptional()
  payeeId: string;

  @IsMongoId()
  @IsOptional()
  employeeId: string;

  @IsBoolean()
  @IsOptional()
  isRecurring: boolean;

  @IsString()
  @IsDateString()
  @IsOptional()
  recurringEndDate: Date;
}
