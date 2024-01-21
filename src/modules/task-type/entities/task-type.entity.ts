import { TaskType } from '@prisma/client';

export class TaskTypeEntity implements TaskType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
