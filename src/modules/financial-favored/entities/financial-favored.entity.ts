import { FinancialFavored } from '@prisma/client';

export class FinancialFavoredEntity implements FinancialFavored {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
