import { CompanyFinanceType } from '@prisma/client';

export class Type implements CompanyFinanceType {
  id: string;
  name: string;
  needApprove: boolean;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  companyId: string;
}
