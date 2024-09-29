import { Client } from '@prisma/client';

export class ClientEntity implements Client {
  active: boolean;
  recurrent: boolean;
  id: string;
  name: string;
  cnpj: string;
  address: string;
  gestorId: string[];
  createdAt: Date;
  updatedAt: Date;
}
