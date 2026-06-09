import { CompanyClient } from '@prisma/client';

export class Client implements CompanyClient {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  createdById: string | null;
  userIds: string[];
}
