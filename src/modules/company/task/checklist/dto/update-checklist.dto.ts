import { PartialType } from '@nestjs/mapped-types';
import { ChecklistDto } from './checklist.dto';

export class UpdateChecklistDto extends PartialType(ChecklistDto) {}
