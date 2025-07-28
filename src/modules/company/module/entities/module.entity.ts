import { CompanyModule } from '@prisma/client';

export class Module implements CompanyModule {
  id: string;
  moduleId: string;
  companyId: string;
}
