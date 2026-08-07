import {
  CompanyClient,
  FiscalAddress,
  PersonTypeEnum,
} from '@prisma/client';

export class Client implements CompanyClient {
  id: string;
  name: string;
  cnpj: string | null;
  address: string | null;
  personType: PersonTypeEnum | null;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  fiscalAddress: FiscalAddress | null;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  createdById: string | null;
  userIds: string[];
}
