import { SetMetadata } from '@nestjs/common';
import { PermissionLevel } from 'src/providers/permission/company-permission.service';

export const REQUIRE_PERMISSION_KEY = 'REQUIRE_PERMISSION';

export type RequiredPermission = {
  module: string;
  level: PermissionLevel;
};

export const RequirePermission = (module: string, level: PermissionLevel) =>
  SetMetadata(REQUIRE_PERMISSION_KEY, {
    module,
    level,
  } satisfies RequiredPermission);
