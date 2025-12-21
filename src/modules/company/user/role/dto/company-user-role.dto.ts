import { IsArray, IsMongoId, IsString } from 'class-validator';

export class AssignUserRoleDto {
  @IsString()
  roleId: string;
}

export class AssignUserClientsDto {
  @IsArray()
  @IsMongoId({ each: true })
  clientIds: string[];
}

export class AssignUserTargetsDto {
  @IsArray()
  @IsMongoId({ each: true })
  targetIds: string[];
}
