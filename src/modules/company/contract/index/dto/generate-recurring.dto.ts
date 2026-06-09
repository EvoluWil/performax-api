import { FinanceFlowEnum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GenerateRecurringDto {
  @IsMongoId()
  @IsNotEmpty()
  typeId: string;

  @IsMongoId()
  @IsNotEmpty()
  bankId: string;

  @IsMongoId()
  @IsNotEmpty()
  methodId: string;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @IsMongoId()
  @IsOptional()
  segmentId?: string;

  @IsString()
  @IsOptional()
  recurrence?: string;

  @IsEnum(FinanceFlowEnum)
  @IsOptional()
  flow?: FinanceFlowEnum;
}
