import { AccessLevelEnum, ContractTypeEnum, Employee } from '@prisma/client';

export class EmployeeEntity implements Employee {
  id: string;
  salary: number;
  admission: Date;
  accessLevel: AccessLevelEnum;
  contractType: ContractTypeEnum;
  attendanceLocations: string[];
  bankInfoId: string;
  roleId: string;
  userId: string;
  managerId: string;
  benefitsId: string[];
}
