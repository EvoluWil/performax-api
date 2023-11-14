import { IsDateString, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeVacationDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  employeeId: string;
}
