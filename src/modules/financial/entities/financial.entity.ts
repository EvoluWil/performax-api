import {
  Financial,
  FinancialFlowEnum,
  FinancialStatusEnum,
} from '@prisma/client';

export class FinancialEntity implements Financial {
  id: string;
  title: string;
  description: string;
  protocol: string;
  value: string;
  tax: string;
  paymentDate: Date;
  date: Date;
  observation: string;
  status: FinancialStatusEnum;
  flow: FinancialFlowEnum;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  typeId: string;
  clientId: string;
  categoryId: string;
  methodId: string;
  favoredId: string;
  bankId: string;
  companyId: string;
}
