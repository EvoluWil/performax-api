import { User, UserRoleEnum } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
  resetToken: string;
  resetTokenExpiry: Date;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
}
