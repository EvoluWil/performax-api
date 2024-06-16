import { PartialType } from '@nestjs/mapped-types';
import { EntryStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateEntryDto } from './create-entry.dto';

export class UpdateEntryDto extends PartialType(CreateEntryDto) {
  @IsString()
  @IsOptional()
  @IsEnum(EntryStatusEnum)
  status: EntryStatusEnum;
}
