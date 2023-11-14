import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompanyBenefitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  valueForEmployee: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  valueForDependents: number;

  @IsNumber()
  @IsNotEmpty()
  valueForCompany: number;

  @IsBoolean()
  @IsNotEmpty()
  isValuePerEmployee: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isDependents: boolean;
}
