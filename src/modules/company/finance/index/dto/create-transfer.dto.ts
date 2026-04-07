import {
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  value: number;

  @IsInt()
  @IsOptional()
  tax?: number;

  @IsInt()
  @IsOptional()
  retention?: number;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsMongoId()
  @IsNotEmpty()
  companyInId: string;

  @IsMongoId()
  @IsOptional()
  bankId?: string;

  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @IsMongoId()
  @IsOptional()
  methodId?: string;
}
