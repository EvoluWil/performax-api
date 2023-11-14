import { Sector } from '@prisma/client';

export class CompanySectorEntity implements Sector {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
}
