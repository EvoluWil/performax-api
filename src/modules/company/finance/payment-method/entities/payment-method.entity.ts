import { CompanyFinancePaymentMethod } from '@prisma/client';

export class PaymentMethod implements CompanyFinancePaymentMethod {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  companyId: string;
}
