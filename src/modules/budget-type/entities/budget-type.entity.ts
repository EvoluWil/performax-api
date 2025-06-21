import { BudgetType } from '@prisma/client';

export class BudgetTypeEntity implements BudgetType {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
