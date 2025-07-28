import {
  ChecklistItemType,
  CompanyTaskChecklist,
  CompanyTaskChecklistItem,
  CompanyTaskChecklistModule,
} from '@prisma/client';

class ChecklistItem implements CompanyTaskChecklistItem {
  id: string;
  question: string;
  expectedType: ChecklistItemType;
  valueBoolean: boolean;
  valueNumber: number;
  valueText: string;
  moduleId: string;
}

class ChecklistModule implements CompanyTaskChecklistModule {
  id: string;
  name: string;
  checklistId: string;
  items: ChecklistItem[];
}

export class Checklist implements CompanyTaskChecklist {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
  modules: ChecklistModule[];
}
