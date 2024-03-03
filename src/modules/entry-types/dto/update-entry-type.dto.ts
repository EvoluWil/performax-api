import { PartialType } from '@nestjs/mapped-types';
import { CreateEntryTypeDto } from './create-entry-type.dto';

export class UpdateEntryTypeDto extends PartialType(CreateEntryTypeDto) {}
