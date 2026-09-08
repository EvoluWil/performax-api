import { CompanyFiscalConfig, TaxRegimeEnum } from '@prisma/client';

export type SpedyTaxRegime =
  | 'simplesNacional'
  | 'simplesNacionalExcessoSublimite'
  | 'simplesNacionalMEI'
  | 'regimeNormal';

export type SpedyAddress = {
  street: string;
  number: string;
  district: string;
  postalCode: string;
  additionalInformation?: string;
  city: { code?: string; name: string; state: string };
  country?: string;
};

export type SpedyCompanyPayload = {
  name: string;
  legalName: string;
  federalTaxNumber: string;
  stateTaxNumber?: string;
  cityTaxNumber?: string;
  email: string;
  phone?: string;
  address: SpedyAddress;
  taxRegime: SpedyTaxRegime;
  economicActivities: { code: string; isMain: boolean }[];
};

export type SpedyCompanySettingsPayload = {
  environmentType: 'development' | 'production';
  serviceInvoice: {
    enabled: boolean;
    series?: string;
    number?: number;
  };
};

const TAX_REGIME_MAP: Record<TaxRegimeEnum, SpedyTaxRegime> = {
  SIMPLES_NACIONAL: 'simplesNacional',
  SIMPLES_NACIONAL_EXCESSO: 'simplesNacionalExcessoSublimite',
  SIMPLES_NACIONAL_MEI: 'simplesNacionalMEI',
  REGIME_NORMAL: 'regimeNormal',
};

function digitsOnly(value?: string | null): string {
  return (value ?? '').replace(/\D/g, '');
}

export function mapTaxRegime(regime: TaxRegimeEnum): SpedyTaxRegime {
  return TAX_REGIME_MAP[regime];
}

export function mapEnvironmentType(
  environment?: string | null,
): 'development' | 'production' {
  const value = (
    environment ??
    process.env.SPEDY_ENVIRONMENT ??
    'development'
  ).toLowerCase();
  return value === 'production' ? 'production' : 'development';
}

export function mapCompanyToSpedy(
  config: CompanyFiscalConfig,
): SpedyCompanyPayload {
  const address = config.address;
  if (!config.legalName || !config.federalTaxNumber || !config.email) {
    throw new Error('Dados cadastrais da empresa incompletos para a Spedy');
  }
  if (!config.taxRegime) {
    throw new Error('Regime tributário é obrigatório para a Spedy');
  }
  if (!address?.street || !address.city || !address.state) {
    throw new Error('Endereço da empresa incompleto para a Spedy');
  }

  const activities = (config.economicActivities ?? []).filter((item) =>
    item.code?.trim(),
  );
  if (!activities.length) {
    throw new Error('Informe ao menos uma atividade econômica (CNAE)');
  }

  return {
    name: config.tradeName?.trim() || config.legalName,
    legalName: config.legalName,
    federalTaxNumber: digitsOnly(config.federalTaxNumber),
    ...(config.stateTaxNumber
      ? { stateTaxNumber: config.stateTaxNumber }
      : {}),
    ...(config.cityTaxNumber ? { cityTaxNumber: config.cityTaxNumber } : {}),
    email: config.email,
    ...(config.phone ? { phone: digitsOnly(config.phone) } : {}),
    address: {
      street: address.street,
      number: address.number?.trim() || 'S/N',
      district: address.neighborhood?.trim() || 'Centro',
      postalCode: digitsOnly(address.postalCode),
      ...(address.complement
        ? { additionalInformation: address.complement }
        : {}),
      city: {
        ...(address.cityCode ? { code: address.cityCode } : {}),
        name: address.city,
        state: address.state,
      },
      country: 'BRA',
    },
    taxRegime: mapTaxRegime(config.taxRegime),
    economicActivities: activities.map((item) => ({
      code: item.code.trim(),
      isMain: item.isMain,
    })),
  };
}

export function mapCompanySettings(
  config: CompanyFiscalConfig,
): SpedyCompanySettingsPayload {
  return {
    environmentType: mapEnvironmentType(),
    serviceInvoice: {
      enabled: true,
      ...(config.rpsSeries ? { series: config.rpsSeries } : {}),
      ...(config.rpsNumber ? { number: config.rpsNumber } : {}),
    },
  };
}
