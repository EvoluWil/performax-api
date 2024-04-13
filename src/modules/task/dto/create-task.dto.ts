import { File, TaskStatusEnum } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
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

  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  status: TaskStatusEnum;
}
