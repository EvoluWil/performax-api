import {
  BiologicalGenderEnum,
  EthnicityEnum,
  GenderEnum,
  MaritalStatusEnum,
} from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  homeState: string;

  @IsNotEmpty()
  @IsString()
  homeCity: string;

  @IsNotEmpty()
  @IsString()
  socialName: string;

  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;

  @IsNotEmpty()
  @IsString()
  matherName: string;

  @IsNotEmpty()
  @IsString()
  fatherName: string;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsEnum(EthnicityEnum)
  @IsNotEmpty()
  ethnicity: EthnicityEnum;

  @IsNotEmpty()
  @IsEnum(MaritalStatusEnum)
  maritalStatus: MaritalStatusEnum;

  @IsNotEmpty()
  @IsEnum(BiologicalGenderEnum)
  biologicalGender: BiologicalGenderEnum;

  @IsBoolean()
  @IsNotEmpty()
  isPwd: boolean;
}
