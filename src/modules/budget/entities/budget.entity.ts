import { Budget, BudgetStatusEnum } from '@prisma/client';

export class BudgetEntity implements Budget {
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
}
