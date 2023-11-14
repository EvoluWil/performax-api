import { ProfileAddress } from '@prisma/client';

export class ProfileAddressEntity implements ProfileAddress {
  id: string;
  streetNumber: string;
  street: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  proof: string;
  createdAt: Date;
  updatedAt: Date;
  profileId: string;
}
