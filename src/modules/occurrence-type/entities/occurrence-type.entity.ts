import { OccurrenceType } from '@prisma/client';

export class OccurrenceTypeEntity implements OccurrenceType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
