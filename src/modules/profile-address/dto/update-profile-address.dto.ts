import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileAddressDto } from './create-profile-address.dto';

export class UpdateProfileAddressDto extends PartialType(
  CreateProfileAddressDto,
) {}
