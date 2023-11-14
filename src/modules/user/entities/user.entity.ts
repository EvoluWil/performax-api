import { User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  cpf: string;
  name: string;
  email: string;
  password: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  resetToken: string;
  resetTokenExpiry: Date;
  adminInIds: string[];
}
