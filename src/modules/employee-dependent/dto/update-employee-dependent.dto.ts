import { KinshipEnum } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateEmployeeDependentDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  matherName: string;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsUrl()
  proof: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(KinshipEnum)
  kinship: KinshipEnum;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  isPwd: boolean;
}
