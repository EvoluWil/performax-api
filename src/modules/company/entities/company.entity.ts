import { Company } from '@prisma/client';

export class CompanyEntity implements Company {
  id: string;
  name: string;
  fantasyName: string;
  cnpj: string;
  address: string;
  state: string;
  city: string;
  addressNumber: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  adminIds: string[];
}
