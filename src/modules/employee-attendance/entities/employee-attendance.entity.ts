import { EmployeeAttendance } from '@prisma/client';

export class EmployeeAttendanceEntity implements EmployeeAttendance {
  id: string;
  date: Date;
  location: string;
  proof: string;
  createdAt: Date;
  updatedAt: Date;
  employeeId: string;
}
