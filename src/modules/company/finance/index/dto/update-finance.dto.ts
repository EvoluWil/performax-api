import { OmitType, PartialType } from '@nestjs/mapped-types';
import { FinanceStatusEnum } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateFinanceDto } from './create-finance.dto';

export class UpdateFinanceDto extends PartialType(
  OmitType(CreateFinanceDto, ['isRecurring', 'recurringEndDate']),
) {
  @IsString()
  @IsOptional()
  @IsEnum(FinanceStatusEnum)
  status: FinanceStatusEnum;

  @IsBoolean()
  @IsOptional()
  paidFromAdvance?: boolean;

  @IsMongoId()
  @IsOptional()
  advanceId?: string;
}
