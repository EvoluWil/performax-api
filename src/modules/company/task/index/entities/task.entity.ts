import { CompanyTask, File, TaskStatusEnum } from '@prisma/client';

export class Task implements CompanyTask {
  id: string;
  protocol: string;
  title: string;
  description: string;
  service: string;
  internalNote: string;
  impedimentNote: string;
  status: TaskStatusEnum;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
  clientId: string;
  companyId: string;
  typeId: string;
  updatedById: string;
  createdById: string;
  budgetId: string;
  deleted: boolean;
  closeBudgetId: string;
  responsibleId: string;
  files: File[];
  conclusionFiles: File[];
}
