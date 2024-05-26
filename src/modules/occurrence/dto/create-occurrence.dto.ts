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
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  resolution: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsArray()
  @IsOptional()
  documents: File[];

  @IsMongoId()
  @IsNotEmpty()
  clientId: string;
}
