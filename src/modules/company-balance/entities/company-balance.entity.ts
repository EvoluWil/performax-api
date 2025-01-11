import { CompanyBalance } from '@prisma/client';

export class CompanyBalanceEntity implements CompanyBalance {
  id: string;
  initialValue: string;
  companyId: string;
}
