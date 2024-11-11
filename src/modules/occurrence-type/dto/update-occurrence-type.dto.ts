import { PartialType } from '@nestjs/mapped-types';
import { CreateOccurrenceTypeDto } from './create-occurrence-type.dto';

export class UpdateOccurrenceTypeDto extends PartialType(CreateOccurrenceTypeDto) {}
