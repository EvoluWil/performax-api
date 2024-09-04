import { Company } from '@prisma/client';

export class CompanyEntity implements Company {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
