import { PartialType } from '@nestjs/mapped-types';
import { OccurrenceStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateOccurrenceDto } from './create-occurrence.dto';

export class UpdateOccurrenceDto extends PartialType(CreateOccurrenceDto) {
  @IsString()
  @IsEnum(OccurrenceStatusEnum)
  @IsOptional()
  status: OccurrenceStatusEnum;
}
