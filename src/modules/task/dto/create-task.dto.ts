import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  files: string[];

  @IsString()
  @IsOptional()
  @IsDateString()
  endDate: Date;
}
