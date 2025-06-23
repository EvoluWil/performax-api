import { OmitType, PartialType } from '@nestjs/mapped-types';
import { FinanceStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateFinanceDto } from './create-finance.dto';

export class UpdateFinanceDto extends PartialType(
  OmitType(CreateFinanceDto, ['isRecurring', 'recurringEndDate']),
) {
  @IsString()
  @IsOptional()
  @IsEnum(FinanceStatusEnum)
  status: FinanceStatusEnum;
}
