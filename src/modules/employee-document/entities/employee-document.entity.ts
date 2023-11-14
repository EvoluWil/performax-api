import { EmployeeDocument, EmployeeDocumentTypeEnum } from '@prisma/client';

export class EmployeeDocumentEntity implements EmployeeDocument {
  id: string;
  name: string;
  proof: string;
  type: EmployeeDocumentTypeEnum;
  createdAt: Date;
  updatedAt: Date;
  employeeId: string;
}
