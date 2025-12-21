export interface CompanyUserRoleEntity {
  id: string;
  userId: string;
  companyId: string;
  roleId?: string;
  targetIds: string[];
  clientIds: string[];
}
