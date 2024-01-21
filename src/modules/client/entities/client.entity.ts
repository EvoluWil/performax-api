import { Client } from '@prisma/client';

export class ClientEntity implements Client {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
