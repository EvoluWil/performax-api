import {
  CompanyRolePermission,
  PermissionEnum,
  PermissionScopeEnum,
} from '@prisma/client';

export class Permission implements CompanyRolePermission {
  id: string;
  scope: PermissionScopeEnum;
  permission: PermissionEnum;
  moduleId: string;
  companyRoleId: string;
}
