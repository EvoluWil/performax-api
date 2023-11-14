import { EducationLevel } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProfileEducationDto {
  @IsString()
  @IsOptional()
  proof: string;

  @IsEnum(EducationLevel)
  @IsNotEmpty()
  level: EducationLevel;

  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsString()
  @IsNotEmpty()
  course: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
