import { User, UserRoleEnum } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  supervisedByIds: string[];
}
