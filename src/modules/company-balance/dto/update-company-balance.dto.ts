import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyBalanceDto } from './create-company-balance.dto';

export class UpdateCompanyBalanceDto extends PartialType(
  CreateCompanyBalanceDto,
) {}
