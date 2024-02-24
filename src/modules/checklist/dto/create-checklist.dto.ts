import { ChecklistRecurrenceEnum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChecklistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ChecklistRecurrenceEnum)
  recurrence: ChecklistRecurrenceEnum;

  @IsDateString()
  @IsOptional()
  lastCheck: Date;

  @IsString()
  @IsMongoId()
  userId: string;
}
