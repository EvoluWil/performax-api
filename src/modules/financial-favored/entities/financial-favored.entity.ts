import { FinancialFavored } from '@prisma/client';

export class FinancialFavoredEntity implements FinancialFavored {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
