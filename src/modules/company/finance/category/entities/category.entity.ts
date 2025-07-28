import { CompanyFinanceCategory } from '@prisma/client';

export class Category implements CompanyFinanceCategory {
  id: string;
  name: string;
  createdAt: Date;
  deleted: boolean;
  updatedAt: Date;
  companyId: string;
}
