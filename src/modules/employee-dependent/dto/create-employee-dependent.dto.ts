import { KinshipEnum } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import { IsCpf } from 'src/decorators/cpf.decorator';

export class CreateEmployeeDependentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsCpf()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  matherName: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  proof: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(KinshipEnum)
  kinship: KinshipEnum;

  @IsBoolean()
  @IsNotEmpty()
  isPwd: boolean;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  employeeId: string;
}
