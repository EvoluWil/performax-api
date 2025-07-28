import { TaskStatusEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChecklistDto } from '../../checklist/dto/checklist.dto';

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
  date: Date;

  @IsString()
  @IsMongoId()
  responsibleId: string;

  @IsString()
  @IsMongoId()
  clientId: string;

  @IsString()
  @IsMongoId()
  typeId: string;

  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  status: TaskStatusEnum;

  @IsString()
  @IsOptional()
  internalNote: string;

  @Type(() => ChecklistDto)
  @IsOptional()
  @ValidateNested()
  checklist: ChecklistDto;
}
