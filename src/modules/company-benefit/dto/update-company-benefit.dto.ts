import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyBenefitDto } from './create-company-benefit.dto';

export class UpdateCompanyBenefitDto extends PartialType(
  CreateCompanyBenefitDto,
) {}
