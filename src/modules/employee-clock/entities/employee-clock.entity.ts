import { EmployeeClock, EmployeeClockEnum } from '@prisma/client';

export class EmployeeClockEntity implements EmployeeClock {
  id: string;
  date: Date;
  type: EmployeeClockEnum;
  createdAt: Date;
  updatedAt: Date;
  employeeId: string;
}
