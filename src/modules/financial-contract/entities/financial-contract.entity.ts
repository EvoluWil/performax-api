import { FinancialContract } from '@prisma/client';

export class FinancialContractEntity implements FinancialContract {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
}
