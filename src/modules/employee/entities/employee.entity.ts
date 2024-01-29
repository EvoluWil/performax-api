import { Employee } from '@prisma/client';

export class EmployeeEntity implements Employee {
  id: string;
  name: string;
  cpf: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
