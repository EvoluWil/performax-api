import { EmployeeDependent, KinshipEnum } from '@prisma/client';

export class EmployeeDependentEntity implements EmployeeDependent {
  id: string;
  name: string;
  cpf: string;
  matherName: string;
  birthDate: Date;
  proof: string;
  kinship: KinshipEnum;
  isPwd: boolean;
  updatedAt: Date;
  createdAt: Date;
  employeeId: string;
  benefitsId: string[];
}
