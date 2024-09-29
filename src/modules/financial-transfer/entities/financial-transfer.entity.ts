import { FinancialTransfer } from '@prisma/client';

export class FinancialTransferEntity implements FinancialTransfer {
  id: string;
  title: string;
  description: string;
  value: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  bankId: string;
  companyInId: string;
  companyOutId: string;
}
