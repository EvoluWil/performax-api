import { Budget, BudgetItem, BudgetStatusEnum } from '@prisma/client';

export class BudgetEntity implements Budget {
  observation: string;
  protocol: string;
  visitedAt: Date;
  confirmed: boolean;
  status: BudgetStatusEnum;
  id: string;
  title: string;
  description: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
  allClients: boolean;
  createdById: string;
  typeId: string;
  clientId: string;
  responsibleId: string;
  items: BudgetItem[];
}
