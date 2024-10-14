import { Balance } from '@prisma/client';

export class FinancialBalance implements Balance {
  id: string;
  value: string;
  updatedAt: Date;
  updatedById: string;
}
