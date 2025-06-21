import { IsEnum, IsNotEmpty } from 'class-validator';

export const UserRoleInCompanyEnum = {
  ADMIN: 'ADMIN',
  COORDINATOR: 'COORDINATOR',
  ATTENDANT: 'ATTENDANT',
  FINANCIAL: 'FINANCIAL',
  GESTOR: 'GESTOR',
  USER: 'USER',
};

export type UserRoleInCompanyEnum =
  (typeof UserRoleInCompanyEnum)[keyof typeof UserRoleInCompanyEnum];

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRoleInCompanyEnum)
  role: UserRoleInCompanyEnum;
}
