import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  fantasyName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  addressNumber: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  zipCode: string;
}
