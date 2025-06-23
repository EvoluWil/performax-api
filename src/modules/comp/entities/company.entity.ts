import { Company } from '@prisma/client';

export class CompanyEntity implements Company {
  id: string;
  name: string;
  logo: string;
  logoReport: string;
  ownerId: string;
  usersId: string[];
  clientsId: string[];
  adminUsersId: string[];
  gestorUsersId: string[];
  financialUsersId: string[];
  attendantUsersId: string[];
  coordinatorUsersId: string[];
  createdAt: Date;
  updatedAt: Date;
}
