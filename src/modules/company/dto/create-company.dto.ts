import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsCnpj } from 'src/decorators/cnpj.decorator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  fantasyName: string;

  @IsString()
  @IsNotEmpty()
  @IsCnpj()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  addressNumber: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;
}
