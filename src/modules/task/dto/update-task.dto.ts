import { PartialType } from '@nestjs/mapped-types';
import { TaskStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status: TaskStatusEnum;

  @IsString()
  @IsOptional()
  service: string;
}
