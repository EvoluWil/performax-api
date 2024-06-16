import { Entry, EntryStatusEnum } from '@prisma/client';

export class EntryEntity implements Entry {
  protocol: string;
  id: string;
  title: string;
  description: string;
  value: string;
  date: Date;
  observation: string;
  approved: boolean;
  status: EntryStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  typeId: string;
  responsibleId: string;
  clientId: string;
}
