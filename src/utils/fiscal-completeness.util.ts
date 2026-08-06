import {
  CompanyClient,
  CompanyFiscalConfig,
  FiscalAddress,
  PersonTypeEnum,
} from '@prisma/client';
import { ViaCepResponse } from './viacep.util';

export type FiscalStatus = {
  ready: boolean;
  missingFields: string[];
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function isFilled(value: string | null | undefined): boolean {
  return !!value?.trim();
}

function getAddressStreet(
  fiscalAddress: FiscalAddress | null | undefined,
  legacyAddress: string | null | undefined,
): string | undefined {
  if (isFilled(fiscalAddress?.street)) return fiscalAddress!.street!.trim();
  if (isFilled(legacyAddress)) return legacyAddress!.trim();
  return undefined;
}

function emptyAddress(): FiscalAddress {
  return {
    street: null,
    number: null,
    complement: null,
    neighborhood: null,
    city: null,
    state: null,
    postalCode: null,
    cityCode: null,
  };
}

function getResolvedAddress(client: CompanyClient): FiscalAddress {
  const fa = client.fiscalAddress ?? emptyAddress();
  return {
    street: getAddressStreet(fa, client.address),
    number: fa.number,
    complement: fa.complement,
    neighborhood: fa.neighborhood,
    city: fa.city,
    state: fa.state,
    postalCode: fa.postalCode,
    cityCode: fa.cityCode,
  };
}

export function getClientFiscalMissingFields(
  client: CompanyClient,
  viaCep?: ViaCepResponse | null,
): string[] {
  const missing: string[] = [];
  const address = getResolvedAddress(client);

  if (!isFilled(client.name)) missing.push('nome');

  const personType = client.personType ?? (client.cnpj ? PersonTypeEnum.PJ : client.cpf ? PersonTypeEnum.PF : undefined);

  if (!personType) {
    missing.push('tipo de pessoa (PF/PJ)');
  } else if (personType === PersonTypeEnum.PF) {
    if (!isFilled(client.cpf)) missing.push('CPF');
  } else if (!isFilled(client.cnpj)) {
    missing.push('CNPJ');
  }

  if (!isFilled(client.email)) missing.push('e-mail');
  if (!isFilled(address.street)) missing.push('endereço (logradouro)');

  const postalCode = digitsOnly(address.postalCode ?? '');
  if (postalCode.length !== 8) missing.push('CEP');

  const district =
    address.neighborhood?.trim() || viaCep?.bairro?.trim();
  if (!district) missing.push('bairro');

  const cityName = address.city?.trim() || viaCep?.localidade;
  const state = address.state?.trim()?.toUpperCase() || viaCep?.uf;
  if (!cityName) missing.push('cidade');
  if (!state) missing.push('UF');

  return missing;
}

export function isClientReadyForNfse(
  client: CompanyClient,
  viaCep?: ViaCepResponse | null,
): boolean {
  return getClientFiscalMissingFields(client, viaCep).length === 0;
}

export function getClientFiscalStatus(
  client: CompanyClient,
  viaCep?: ViaCepResponse | null,
): FiscalStatus {
  const missingFields = getClientFiscalMissingFields(client, viaCep);
  return { ready: missingFields.length === 0, missingFields };
}

export function getCompanyFiscalMissingFields(
  config: CompanyFiscalConfig | null | undefined,
): string[] {
  if (!config) {
    return [
      'razão social',
      'CNPJ',
      'e-mail',
      'endereço',
      'regime tributário',
      'atividade econômica (CNAE)',
      'código federal do serviço',
      'série RPS',
      'número RPS',
    ];
  }

  const missing: string[] = [];
  const address = config.address ?? emptyAddress();

  if (!isFilled(config.legalName)) missing.push('razão social');
  if (!isFilled(config.federalTaxNumber)) missing.push('CNPJ');
  if (!isFilled(config.email)) missing.push('e-mail');
  if (!isFilled(address.street)) missing.push('endereço (logradouro)');
  if (!isFilled(address.number)) missing.push('número do endereço');
  if (!isFilled(address.neighborhood)) missing.push('bairro');
  if (digitsOnly(address.postalCode ?? '').length !== 8) missing.push('CEP');
  if (!isFilled(address.city)) missing.push('cidade');
  if (!isFilled(address.state)) missing.push('UF');
  if (!config.taxRegime) missing.push('regime tributário');

  const activities = config.economicActivities ?? [];
  if (activities.length === 0) {
    missing.push('atividade econômica (CNAE)');
  } else if (!activities.some((a) => a.isMain)) {
    missing.push('CNAE principal');
  }

  if (!isFilled(config.federalServiceCode)) {
    missing.push('código federal do serviço');
  }
  if (!isFilled(config.rpsSeries)) missing.push('série RPS');
  if (!config.rpsNumber || config.rpsNumber < 1) missing.push('número RPS');

  return missing;
}

export function isCompanyReadyForNfse(
  config: CompanyFiscalConfig | null | undefined,
): boolean {
  return getCompanyFiscalMissingFields(config).length === 0;
}

export function getCompanyFiscalStatus(
  config: CompanyFiscalConfig | null | undefined,
): FiscalStatus {
  const missingFields = getCompanyFiscalMissingFields(config);
  return { ready: missingFields.length === 0, missingFields };
}

/**
 * Spedy field mapping (phase 2):
 * tradeName -> name, legalName -> legalName, federalTaxNumber -> federalTaxNumber
 * client.cpf|cnpj -> receiver.federalTaxNumber, fiscalAddress -> address.*
 * TaxRegimeEnum -> taxRegime (camelCase)
 */
export function mapClientForResponse(client: CompanyClient): CompanyClient {
  const fa = client.fiscalAddress ?? emptyAddress();
  if (!fa.street && client.address) {
    return {
      ...client,
      fiscalAddress: { ...fa, street: client.address },
    };
  }
  return client;
}
