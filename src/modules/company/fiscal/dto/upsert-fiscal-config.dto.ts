import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { TaxRegimeEnum } from '@prisma/client';

export class FiscalAddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  cityCode?: string;
}

export class EconomicActivityDto {
  @IsString()
  code: string;

  @IsBoolean()
  isMain: boolean;
}

export class UpsertFiscalConfigDto {
  @IsString()
  @IsOptional()
  legalName?: string;

  @IsString()
  @IsOptional()
  tradeName?: string;

  @IsString()
  @IsOptional()
  federalTaxNumber?: string;

  @IsString()
  @IsOptional()
  stateTaxNumber?: string;

  @IsString()
  @IsOptional()
  cityTaxNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @ValidateNested()
  @Type(() => FiscalAddressDto)
  @IsOptional()
  address?: FiscalAddressDto;

  @IsEnum(TaxRegimeEnum)
  @IsOptional()
  taxRegime?: TaxRegimeEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EconomicActivityDto)
  @IsOptional()
  economicActivities?: EconomicActivityDto[];

  @IsString()
  @IsOptional()
  certificateFileName?: string;

  @IsString()
  @IsOptional()
  certificateFileBase64?: string;

  @IsString()
  @IsOptional()
  certificatePassword?: string;

  @IsString()
  @IsOptional()
  federalServiceCode?: string;

  @IsString()
  @IsOptional()
  nationalTaxationCode?: string;

  @IsString()
  @IsOptional()
  cityServiceCode?: string;

  @IsString()
  @IsOptional()
  nbsCode?: string;

  @IsString()
  @IsOptional()
  cnaeCode?: string;

  @IsString()
  @IsOptional()
  taxationType?: string;

  @IsString()
  @IsOptional()
  taxLocation?: string;

  @IsNumber()
  @IsOptional()
  issRate?: number;

  @IsBoolean()
  @IsOptional()
  issWithheld?: boolean;

  @IsString()
  @IsOptional()
  rpsSeries?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  rpsNumber?: number;
}
