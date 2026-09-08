import {
  CompanyFiscalConfig,
  EconomicActivity,
  FiscalAddress,
  FiscalEnvironmentTypeEnum,
  SpedySyncStatusEnum,
  TaxRegimeEnum,
} from '@prisma/client';
import { Prisma } from '@prisma/client';

export class FiscalConfigEntity
  implements
    Omit<
      CompanyFiscalConfig,
      | 'certificatePassword'
      | 'certificateFileBase64'
      | 'spedyApiKey'
      | 'taxLocation'
    >
{
  id: string;
  legalName: string | null;
  tradeName: string | null;
  federalTaxNumber: string | null;
  stateTaxNumber: string | null;
  cityTaxNumber: string | null;
  email: string | null;
  phone: string | null;
  address: FiscalAddress | null;
  taxRegime: TaxRegimeEnum | null;
  economicActivities: EconomicActivity[];
  spedyCompanyId: string | null;
  hasSpedyApiKey: boolean;
  certificateFileName: string | null;
  hasCertificate: boolean;
  hasCertificatePassword: boolean;
  certificateExpiresAt: Date | null;
  certificateUploadedAt: Date | null;
  environmentType: FiscalEnvironmentTypeEnum;
  spedySyncStatus: SpedySyncStatusEnum;
  spedySyncError: string | null;
  spedySyncedAt: Date | null;
  cityProviderOptions: Prisma.JsonValue | null;
  federalServiceCode: string | null;
  nationalTaxationCode: string | null;
  cityServiceCode: string | null;
  nbsCode: string | null;
  cnaeCode: string | null;
  taxationType: string | null;
  issRate: number | null;
  issWithheld: boolean | null;
  rpsSeries: string | null;
  rpsNumber: number | null;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
}
