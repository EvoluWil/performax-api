import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFinancialTransferDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  bankId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  companyInId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  companyOutId: string;
}
