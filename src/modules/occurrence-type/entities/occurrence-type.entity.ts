import { OccurrenceType } from '@prisma/client';

export class OccurrenceTypeEntity implements OccurrenceType {
  companyId: string;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
