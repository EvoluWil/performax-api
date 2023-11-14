import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateEmployeeBankInfoDto {
  @IsNumber()
  @IsNotEmpty()
  bank: number;

  @IsNumber()
  @IsNotEmpty()
  agency: number;

  @IsNumber()
  @IsNotEmpty()
  account: number;

  @IsString()
  @IsNotEmpty()
  pix: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  proof: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  employeeId: string;
}
