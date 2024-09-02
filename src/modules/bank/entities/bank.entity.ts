import { Bank } from '@prisma/client';

export class BankEntity implements Bank {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
