import { BudgetItem, BudgetStatusEnum, CompanyBudget } from '@prisma/client';

export class Budget implements CompanyBudget {
  id: string;
  protocol: string;
  title: string;
  description: string;
  observation: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  status: BudgetStatusEnum;
  approved: boolean;
  createdById: string;
  typeId: string;
  clientId: string;
  deleted: boolean;
  responsibleId: string;
  companyId: string;
  items: BudgetItem[];
}
