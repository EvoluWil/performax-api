import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'BE667900D79DC46725C45678ASG23B861263C4B816E03F63';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
