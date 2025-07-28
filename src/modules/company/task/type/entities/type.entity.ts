import { CompanyTaskType } from '@prisma/client';

export class Type implements CompanyTaskType {
  id: string;
  name: string;
  needApprove: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
}
