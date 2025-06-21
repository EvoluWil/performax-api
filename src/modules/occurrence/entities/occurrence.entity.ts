import { File, Occurrence } from '@prisma/client';

export class OccurrenceEntity implements Occurrence {
  id: string;
  date: Date;
  title: string;
  protocol: string;
  documents: File[];
  resolution: string;
  description: string;
  typeId: string;
  clientId: string;
  companyId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}
