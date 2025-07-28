import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CreatePermissionDto } from '../../permission/dto/create-permission.dto';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isAdmin: boolean;

  @IsArray()
  @Type(() => CreatePermissionDto)
  permissions: CreatePermissionDto[];
}
