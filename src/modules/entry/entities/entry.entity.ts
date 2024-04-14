import { Entry } from '@prisma/client';

export class EntryEntity implements Entry {
  visitedAt: Date;
  confirmed: boolean;
  id: string;
  title: string;
  description: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
  allClients: boolean;
  createdById: string;
  typeId: string;
  clientId: string;
}
