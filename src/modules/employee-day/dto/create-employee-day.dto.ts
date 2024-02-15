import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateEmployeeDayDto {
  @IsDateString()
  @IsNotEmpty()
  in: string;

  @IsDateString()
  @IsNotEmpty()
  out: string;

  @IsDateString()
  @IsNotEmpty()
  inLunch: string;

  @IsDateString()
  @IsNotEmpty()
  outLunch: string;
}
