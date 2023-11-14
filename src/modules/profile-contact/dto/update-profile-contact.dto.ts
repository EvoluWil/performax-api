import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileContactDto } from './create-profile-contact.dto';

export class UpdateProfileContactDto extends PartialType(CreateProfileContactDto) {}
