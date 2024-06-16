import { EntryType } from '@prisma/client';

export class EntryTypeEntity implements EntryType {
  id: string;
  name: string;
  needApprove: boolean;
  createdAt: Date;
  updatedAt: Date;
}
