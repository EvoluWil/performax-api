import { PartialType } from '@nestjs/mapped-types';
import { File, TaskStatusEnum } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum;

  @IsString()
  @IsOptional()
  service?: string;

  @IsArray()
  @IsOptional()
  conclusionFiles?: File[];
}
