import { CompanyOccurrenceType } from '@prisma/client';

export class Type implements CompanyOccurrenceType {
  id: string;
  name: string;
  needApprove: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
}
