import { FinanceFlowEnum } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReceivableDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  observation?: string;

  /** Total value in cents */
  @IsInt()
  @IsNotEmpty()
  totalValue: number;

  /** Number of monthly installments (1–360) */
  @IsInt()
  @Min(1)
  @Max(360)
  installmentCount: number;

  /** First installment due date (ISO string) — subsequent ones +30 days each */
  @IsString()
  @IsNotEmpty()
  firstDueDate: string;

  @IsEnum(FinanceFlowEnum)
  flow: FinanceFlowEnum;

  @IsMongoId()
  bankId: string;

  @IsMongoId()
  methodId: string;

  @IsMongoId()
  @IsOptional()
  typeId?: string;

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

  @IsMongoId()
  @IsOptional()
  employeeId?: string;

  @IsMongoId()
  @IsOptional()
  responsibleId?: string;
}
