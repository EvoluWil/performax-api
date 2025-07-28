import { ChecklistItemType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ChecklistItemDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsEnum(ChecklistItemType)
  expectedType: ChecklistItemType;
}
