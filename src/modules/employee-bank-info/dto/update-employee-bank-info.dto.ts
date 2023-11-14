import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateEmployeeBankInfoDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  bank: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  agency: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  account: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  pix: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsUrl()
  proof: string;
}
