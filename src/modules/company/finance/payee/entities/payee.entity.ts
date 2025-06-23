import { CompanyFinancePayee } from '@prisma/client';

export class Payee implements CompanyFinancePayee {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  companyId: string;
}
