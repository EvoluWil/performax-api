import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeClockDto {
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
