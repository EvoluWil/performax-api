import {
  Financial,
  FinancialRecurrenceTypeEnum,
  FinancialTypeEnum,
} from '@prisma/client';

export class FinancialEntity implements Financial {
  id: string;
  description: string;
  value: string;
  observation: string;
  createdAt: Date;
  updatedAt: Date;
  type: FinancialTypeEnum;
  partnerId: string;
  categoryId: string;
  recurrenceId: string;
  contractId: string;
  companyId: string;
  startDate: Date;
  endDate: Date;
  recurrence: FinancialRecurrenceTypeEnum;
}
