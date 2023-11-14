import { Role } from '@prisma/client';

export class CompanyRoleEntity implements Role {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  sectorId: string;
}
