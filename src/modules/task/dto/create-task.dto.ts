import { File } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  files: File[];

  @IsString()
  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsString()
  @IsMongoId()
  userId: string;

  @IsString()
  @IsMongoId()
  clientId: string;

  @IsString()
  @IsMongoId()
  typeId: string;
}
