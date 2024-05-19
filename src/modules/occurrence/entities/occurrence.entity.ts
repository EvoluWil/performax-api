import { Occurrence } from '@prisma/client';

export class OccurrenceEntity implements Occurrence {
  id: string;
  title: string;
  description: string;
  date: Date;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  clientId: string;
}
