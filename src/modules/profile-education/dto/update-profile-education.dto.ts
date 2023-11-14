import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileEducationDto } from './create-profile-education.dto';

export class UpdateProfileEducationDto extends PartialType(CreateProfileEducationDto) {}
