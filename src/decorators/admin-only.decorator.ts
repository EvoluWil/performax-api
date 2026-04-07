import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_ONLY_KEY = 'ADMIN_ONLY_ROUTE';
export const AdminOnly = () => SetMetadata(IS_ADMIN_ONLY_KEY, true);
