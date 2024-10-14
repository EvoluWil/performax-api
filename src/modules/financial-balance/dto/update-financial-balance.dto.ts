import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialBalanceDto } from './create-financial-balance.dto';

export class UpdateFinancialBalanceDto extends PartialType(
  CreateFinancialBalanceDto,
) {}
