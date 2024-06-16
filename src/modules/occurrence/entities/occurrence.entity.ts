import { File, Occurrence } from '@prisma/client';

export class OccurrenceEntity implements Occurrence {
  protocol: string;
  id: string;
  title: string;
  description: string;
  resolution: string;
  date: Date;
  documents: File[];
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  clientId: string;
}
