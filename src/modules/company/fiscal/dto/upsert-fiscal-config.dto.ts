import { FiscalEnvironmentTypeEnum, TaxRegimeEnum } from '@prisma/client';
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
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsCnpj } from 'src/decorators/cnpj.decorator';

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

  @ValidateIf((dto: UpsertFiscalConfigDto) => !!dto.federalTaxNumber?.trim())
  @IsString()
  @IsCnpj()
  @IsOptional()
  federalTaxNumber?: string;

  @IsString()
  @IsOptional()
  stateTaxNumber?: string;

  @IsString()
  @IsOptional()
  cityTaxNumber?: string;

  @ValidateIf((dto: UpsertFiscalConfigDto) => !!dto.email?.trim())
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

  @IsEnum(FiscalEnvironmentTypeEnum)
  @IsOptional()
  environmentType?: FiscalEnvironmentTypeEnum;
}

export class SyncFiscalConfigDto {
  @IsString()
  @IsOptional()
  certificatePassword?: string;

  @IsString()
  @IsOptional()
  certificateFileName?: string;

  @IsString()
  @IsOptional()
  certificateFileBase64?: string;
}
