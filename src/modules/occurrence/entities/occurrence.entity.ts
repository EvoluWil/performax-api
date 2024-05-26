import { File, Occurrence } from '@prisma/client';

export class OccurrenceEntity implements Occurrence {
  id: string;
  title: string;
  description: string;
  date: Date;
  documents: File[];
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  clientId: string;
}
