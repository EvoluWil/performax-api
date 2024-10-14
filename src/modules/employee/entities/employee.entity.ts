import { Employee } from '@prisma/client';

export class EmployeeEntity implements Employee {
  id: string;
  name: string;
  cpf: string;
  active: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
