import { CompanyFinanceBank } from '@prisma/client';

export class Bank implements CompanyFinanceBank {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  companyId: string;
}
