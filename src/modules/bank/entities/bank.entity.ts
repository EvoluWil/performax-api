import { Bank } from '@prisma/client';

export class BankEntity implements Bank {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
