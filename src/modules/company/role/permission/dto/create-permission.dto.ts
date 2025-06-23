import { PermissionEnum, PermissionScopeEnum } from '@prisma/client';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsEnum(PermissionScopeEnum)
  @IsNotEmpty()
  scope: PermissionScopeEnum;

  @IsEnum(PermissionEnum)
  @IsNotEmpty()
  permission: PermissionEnum;

  @IsMongoId()
  @IsNotEmpty()
  moduleId: string;
}
