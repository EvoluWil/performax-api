import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialTypeDto } from './create-financial-type.dto';

export class UpdateFinancialTypeDto extends PartialType(
  CreateFinancialTypeDto,
) {}
