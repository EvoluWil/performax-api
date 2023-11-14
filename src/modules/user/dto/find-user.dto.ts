import { Expose } from 'class-transformer';
import { ProfileEntity } from 'src/modules/profile/entities/profile.entity';

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
  profile: ProfileEntity;

  @Expose()
  profileId: string;

  password: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
