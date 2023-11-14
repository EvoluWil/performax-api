import { Benefit } from '@prisma/client';

export class CompanyBenefitEntity implements Benefit {
  id: string;
  name: string;
  description: string;
  valueForEmployee: number;
  valueForDependents: number;
  valueForCompany: number;
  isValuePerEmployee: boolean;
  isDependents: boolean;
  createdAt: Date;
  updatedAt: Date;
  employeesId: string[];
  dependentsId: string[];
  companyId: string;
}
