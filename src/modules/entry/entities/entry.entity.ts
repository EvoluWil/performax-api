import { Entry, EntryStatusEnum } from '@prisma/client';

export class EntryEntity implements Entry {
  id: string;
  title: string;
  description: string;
  value: string;
  date: Date;
  observation: string;
  approved: boolean;
  protocol: string;
  status: EntryStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  companyId: string;
  typeId: string;
  responsibleId: string;
  employeeId: string;
  clientId: string;
}
