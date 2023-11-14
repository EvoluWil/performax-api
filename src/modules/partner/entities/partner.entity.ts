import { Partner, PartnerTypeEnum } from '@prisma/client';

export class PartnerEntity implements Partner {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  phone: string;
  document: string;
  type: PartnerTypeEnum;
  active: boolean;
}
