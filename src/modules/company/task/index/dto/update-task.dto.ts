import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  @IsOptional()
  impedimentNote?: string;

  @IsString()
  @IsOptional()
  conclusionNote?: string;

  @IsArray()
  @IsOptional()
  conclusionFiles?: File[];
}
