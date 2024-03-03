import { Checklist, ChecklistRecurrenceEnum } from '@prisma/client';

export class ChecklistEntity implements Checklist {
  id: string;
  name: string;
  startDate: Date;
  recurrence: ChecklistRecurrenceEnum;
  lastCheck: Date;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  checks: Date[];
}
