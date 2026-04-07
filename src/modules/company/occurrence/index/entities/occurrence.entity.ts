import { CompanyOccurrence, File, OccurrenceStatusEnum } from '@prisma/client';

export class Occurrence implements CompanyOccurrence {
  id: string;
  title: string;
  description: string;
  observation: string;
  protocol: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  status: OccurrenceStatusEnum;
  approved: boolean;
  createdById: string;
  clientId: string;
  typeId: string;
  deleted: boolean;
  responsibleId: string;
  companyId: string;
  documents: File[];
}
