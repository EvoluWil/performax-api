import { EmployeeVacation, VacationStatusEnum } from '@prisma/client';

export class EmployeeVacationEntity implements EmployeeVacation {
  id: string;
  startDate: Date;
  endDate: Date;
  obs: string;
  status: VacationStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  employeeId: string;
}
