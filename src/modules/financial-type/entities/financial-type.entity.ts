import { FinancialType } from '@prisma/client';

export class FinancialTypeEntity implements FinancialType {
  id: string;
  name: string;
  needApprove: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
