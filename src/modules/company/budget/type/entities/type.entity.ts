import { CompanyBudgetType } from '@prisma/client';

export class Type implements CompanyBudgetType {
  id: string;
  name: string;
  needApprove: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
}
