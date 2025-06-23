import { SetMetadata } from '@nestjs/common';

export const IS_SYSTEM_ADMIN_KEY = 'BE667900D79DC46725C45678ASG23B8FB816E03F63';
export const IsSystemAdmin = () => SetMetadata(IS_SYSTEM_ADMIN_KEY, true);
