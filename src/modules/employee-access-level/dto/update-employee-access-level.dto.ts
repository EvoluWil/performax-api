import { AccessLevelEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateEmployeeAccessLevelDto {
  @IsNotEmpty()
  @IsEnum(AccessLevelEnum)
  accessLevel: AccessLevelEnum;
}
