import { ExpenseType } from '@prisma/client';

export class ExpenseTypeEntity implements ExpenseType {
  id: string;
  name: string;
  needApprove: boolean;
  createdAt: Date;
  updatedAt: Date;
}
