import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProfileAddressDto {
  @IsString()
  @IsOptional()
  streetNumber: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsOptional()
  complement: string;

  @IsString()
  @IsOptional()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  proof: string;
}
