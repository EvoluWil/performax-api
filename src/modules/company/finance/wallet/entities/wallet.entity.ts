import { CompanyFinanceWallet } from '@prisma/client';

export class Wallet implements CompanyFinanceWallet {
  id: string;
  amount: number;
  updatedAt: Date;
  createdAt: Date;
  companyId: string;
}
