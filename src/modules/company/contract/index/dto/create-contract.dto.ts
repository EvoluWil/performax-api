import { File } from '@prisma/client';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateContractDto {
  @IsMongoId()
  @IsNotEmpty()
  clientId: string;

  @IsMongoId()
  @IsNotEmpty()
  typeId: string;

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsObject()
  @IsOptional()
  generatedPdf?: File;
}
