import { File } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOccurrenceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsString()
  @IsMongoId()
  @IsOptional()
  clientId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  typeId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  responsibleId: string;

  @IsArray()
  @IsOptional()
  documents: File[];
}
