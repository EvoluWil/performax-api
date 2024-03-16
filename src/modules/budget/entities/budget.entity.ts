import { Budget } from '@prisma/client';

export class BudgetEntity implements Budget {
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
