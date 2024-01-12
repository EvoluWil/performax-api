import { UserRoleEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
