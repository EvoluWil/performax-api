import { ProfileContact } from '@prisma/client';

export class ProfileContactEntity implements ProfileContact {
  id: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  profileId: string;
}
