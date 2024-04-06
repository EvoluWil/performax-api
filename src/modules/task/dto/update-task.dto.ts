import { PartialType } from '@nestjs/mapped-types';
import { File } from '@prisma/client';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  @IsOptional()
  service?: string;

  @IsArray()
  @IsOptional()
  conclusionFiles?: File[];
}
