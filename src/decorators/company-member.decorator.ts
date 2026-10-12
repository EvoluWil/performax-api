import { SetMetadata } from '@nestjs/common';

export const COMPANY_MEMBER_KEY = 'COMPANY_MEMBER';

export const CompanyMember = () => SetMetadata(COMPANY_MEMBER_KEY, true);
