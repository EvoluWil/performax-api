import { CompanyEmployee } from '@prisma/client';

export class Employee implements CompanyEmployee {
  id: string;
  name: string;
  cpf: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  clientId: string;
  companyId: string;
}
