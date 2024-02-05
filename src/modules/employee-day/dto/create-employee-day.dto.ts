import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDayDto {
  @IsString()
  @IsDateString()
  @IsOptional()
  date: Date;

  @IsString()
  @IsMongoId()
  employeeId: string;

  @IsString()
  @IsMongoId()
  inClockId: string;
}
