import {
  IsDateString,
  IsLatLong,
  IsMongoId,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';

export class CreateEmployeeAttendanceDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsLatLong()
  location: string;

  @IsNotEmpty()
  @IsUrl()
  proof: string;

  @IsNotEmpty()
  @IsMongoId()
  employeeId: string;
}
