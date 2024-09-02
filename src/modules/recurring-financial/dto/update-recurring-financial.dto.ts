import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { CreateFinancialDto } from 'src/modules/financial/dto/create-financial.dto';

export class UpdateRecurringFinancialDto extends PartialType(
  OmitType(CreateFinancialDto, ['isRecurring']),
) {
  @IsString()
  @IsDateString()
  @IsOptional()
  lastDate: Date;
}
