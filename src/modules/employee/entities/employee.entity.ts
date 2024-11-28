import { Employee } from '@prisma/client';

export class EmployeeEntity implements Employee {
  place: string;
  id: string;
  name: string;
  role: string;
  cpf: string;
  active: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
