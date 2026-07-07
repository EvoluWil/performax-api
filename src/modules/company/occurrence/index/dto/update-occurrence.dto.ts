import { PartialType } from '@nestjs/mapped-types';
import { File, OccurrenceStatusEnum } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateOccurrenceDto } from './create-occurrence.dto';

export class UpdateOccurrenceDto extends PartialType(CreateOccurrenceDto) {
  @IsString()
  @IsEnum(OccurrenceStatusEnum)
  @IsOptional()
  status: OccurrenceStatusEnum;

  @IsString()
  @IsOptional()
  conclusionNote?: string;

  @IsArray()
  @IsOptional()
  conclusionFiles?: File[];
}
