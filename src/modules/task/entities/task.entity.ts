import { File, Task, TaskStatusEnum } from '@prisma/client';

export class TaskEntity implements Task {
  protocol: string;
  internalNote: string;
  impedimentNote: string;
  id: string;
  title: string;
  description: string;
  files: File[];
  createdAt: Date;
  createdById: string;
  updatedAt: Date;
  updatedById: string;
  userId: string;
  status: TaskStatusEnum;
  service: string;
  endDate: Date;
  conclusionFiles: File[];
  clientId: string;
  typeId: string;
  budgetId: string;
}
