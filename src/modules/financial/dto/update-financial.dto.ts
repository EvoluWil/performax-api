import { OmitType, PartialType } from '@nestjs/mapped-types';
import { FinancialStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateFinancialDto } from './create-financial.dto';

export class UpdateFinancialDto extends PartialType(
  OmitType(CreateFinancialDto, ['isRecurring', 'recurringEndDate']),
) {
  @IsString()
  @IsOptional()
  @IsEnum(FinancialStatusEnum)
  status: FinancialStatusEnum;
}
