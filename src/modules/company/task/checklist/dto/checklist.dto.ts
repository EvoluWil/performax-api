import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { ChecklistModuleDto } from './checklist-module.dto';

export class ChecklistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ChecklistModuleDto)
  modules: ChecklistModuleDto[];
}
