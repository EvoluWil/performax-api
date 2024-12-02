import { Employee } from '@prisma/client';

export class EmployeeEntity implements Employee {
  id: string;
  name: string;
  role: string;
  cpf: string;
  active: boolean;
  password: string;
  place: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}
