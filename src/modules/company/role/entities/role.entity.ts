import { CompanyRole } from '@prisma/client';

export class Role implements CompanyRole {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  companyId: string;
}
