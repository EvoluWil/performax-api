import { CompanyEntry, EntryStatusEnum } from '@prisma/client';

export class Entry implements CompanyEntry {
  id: string;
  title: string;
  description: string;
  observation: string;
  protocol: string;
  value: number;
  date: Date;
  approved: boolean;
  status: EntryStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  typeId: string;
  deleted: boolean;
  responsibleId: string;
  clientId: string;
  employeeId: string;
  companyId: string;
}
