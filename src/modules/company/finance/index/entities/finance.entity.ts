import {
  CompanyFinance,
  FinanceFlowEnum,
  FinanceStatusEnum,
} from '@prisma/client';

export class Finance implements CompanyFinance {
  receivableId: string;
  receivableInstallment: number;
  isInstallment: boolean;
  advanceId: string;
  paidFromAdvance: boolean;
  isAdvanceDeposit: boolean;
  responsibleId: string;
  id: string;
  title: string;
  description: string;
  protocol: string;
  value: number;
  tax: number;
  retention: number;
  date: Date;
  paymentDate: Date;
  observation: string;
  status: FinanceStatusEnum;
  approved: boolean;
  flow: FinanceFlowEnum;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  typeId: string;
  clientId: string;
  methodId: string;
  bankId: string;
  deleted: boolean;
  companyId: string;
  companyInId: string;
  categoryId: string;
  payeeId: string;
  employeeId: string;
  linkedFinanceId: string;
  recurrenceMasterId: string;
  segmentId: string;
}
