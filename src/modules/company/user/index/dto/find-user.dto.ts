import { UserRoleEnum } from '@prisma/client';
import { Expose } from 'class-transformer';

export class FindUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  cpf: string;

  @Expose()
  email: string;

  @Expose()
  role: UserRoleEnum;

  @Expose()
  profileId: string;

  @Expose()
  deleted: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
