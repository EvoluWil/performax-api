import { $Enums, Expense } from '@prisma/client';

export class ExpenseEntity implements Expense {
  id: string;
  title: string;
  description: string;
  protocol: string;
  value: string;
  date: Date;
  observation: string;
  status: $Enums.ExpenseStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  typeId: string;
  clientId: string;
}
