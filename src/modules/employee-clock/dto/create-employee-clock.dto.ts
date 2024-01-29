import { EmployeeClockEnum } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeClockDto {
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(EmployeeClockEnum)
  type: EmployeeClockEnum;
}
