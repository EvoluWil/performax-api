import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeClockDto } from './create-employee-clock.dto';

export class UpdateEmployeeClockDto extends PartialType(CreateEmployeeClockDto) {}
