import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDayDto } from './create-employee-day.dto';

export class UpdateEmployeeDayDto extends PartialType(CreateEmployeeDayDto) {}
