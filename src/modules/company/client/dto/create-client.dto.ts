import { PersonTypeEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsCnpj } from 'src/decorators/cnpj.decorator';
import { IsCpf } from 'src/decorators/cpf.decorator';
import { FiscalAddressDto } from '../../fiscal/dto/upsert-fiscal-config.dto';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((o: CreateClientDto) => !!o.cnpj?.trim())
  @IsString()
  @IsCnpj()
  @IsOptional()
  cnpj?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(PersonTypeEnum)
  @IsOptional()
  personType?: PersonTypeEnum;

  @ValidateIf((o: CreateClientDto) => !!o.cpf?.trim())
  @IsString()
  @IsCpf()
  @IsOptional()
  cpf?: string;

  @ValidateIf((o: CreateClientDto) => !!o.email?.trim())
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @ValidateNested()
  @Type(() => FiscalAddressDto)
  @IsOptional()
  fiscalAddress?: FiscalAddressDto;
}
