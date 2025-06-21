import { FinancialCategory } from '@prisma/client';

export class FinancialCategoryEntity implements FinancialCategory {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
