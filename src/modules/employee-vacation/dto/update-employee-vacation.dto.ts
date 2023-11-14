import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateEmployeeVacationDto {
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  endDate: Date;
}
