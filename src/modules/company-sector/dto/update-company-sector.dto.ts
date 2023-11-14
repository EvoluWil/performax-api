import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanySectorDto } from './create-company-sector.dto';

export class UpdateCompanySectorDto extends PartialType(
  CreateCompanySectorDto,
) {}
