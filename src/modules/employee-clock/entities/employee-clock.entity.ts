import { EmployeeClock } from '@prisma/client';

export class EmployeeClockEntity implements EmployeeClock {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
