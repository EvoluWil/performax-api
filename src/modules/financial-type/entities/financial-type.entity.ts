import { FinancialType } from '@prisma/client';

export class FinancialTypeEntity implements FinancialType {
  id: string;
  name: string;
  needApprove: boolean;
  createdAt: Date;
  updatedAt: Date;
}
