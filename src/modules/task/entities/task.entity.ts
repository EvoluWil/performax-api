import { Task, TaskStatusEnum } from '@prisma/client';

export class TaskEntity implements Task {
  id: string;
  title: string;
  description: string;
  files: string[];
  createdAt: Date;
  updatedAt: Date;
  updatedById: string;
  userId: string;
  status: TaskStatusEnum;
  endDate: Date;
}
