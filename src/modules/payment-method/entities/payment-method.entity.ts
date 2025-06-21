import { PaymentMethod } from '@prisma/client';

export class PaymentMethodEntity implements PaymentMethod {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
