import { EmployeeDay } from '@prisma/client';

export class EmployeeDayEntity implements EmployeeDay {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  employeeId: string;
  inClockId: string;
  outClockId: string;
  inLunchClockId: string;
  outLunchClockId: string;
}
