import { Expose } from 'class-transformer';

export class FindUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  cpf: string;

  @Expose()
  name: string;

  @Expose()
  profileId: string;

  password: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
