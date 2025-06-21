import { EntryType } from '@prisma/client';

export class EntryTypeEntity implements EntryType {
  id: string;
  name: string;
  needApprove: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
