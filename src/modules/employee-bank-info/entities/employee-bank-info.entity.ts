import { EmployeeBankInfo } from '@prisma/client';

export class EmployeeBankInfoEntity implements EmployeeBankInfo {
  id: string;
  bank: number;
  agency: number;
  account: number;
  pix: string;
  proof: string;
  createdAt: Date;
  updatedAt: Date;
}
