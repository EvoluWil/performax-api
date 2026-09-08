import * as assert from 'node:assert/strict';
import { CompanyClient, CompanyFiscalConfig, PersonTypeEnum, SpedySyncStatusEnum } from '@prisma/client';
import {
  getClientFiscalMissingFields,
  getCompanyCadastroMissingFields,
  getCompanyFiscalMissingFields,
  getCompanyFiscalStatus,
} from './fiscal-completeness.util';

function client(partial: Partial<CompanyClient> = {}): CompanyClient {
  return {
    id: '1',
    name: 'Cliente',
    cnpj: '12345678000190',
    address: null,
    personType: PersonTypeEnum.PJ,
    cpf: null,
    email: 'a@b.com',
    phone: null,
    fiscalAddress: {
      street: 'Rua A',
      number: '10',
      complement: null,
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01310100',
      cityCode: '3550308',
    },
    deleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    companyId: 'c1',
    createdById: null,
    userIds: [],
    ...partial,
  } as CompanyClient;
}

assert.deepEqual(getClientFiscalMissingFields(client()), []);
assert.ok(
  getClientFiscalMissingFields(
    client({ personType: PersonTypeEnum.PF, cnpj: null, cpf: null }),
  ).includes('CPF'),
);
assert.ok(
  getClientFiscalMissingFields(
    client({ personType: PersonTypeEnum.PJ, cnpj: null, cpf: null }),
  ).includes('CNPJ'),
);
assert.ok(
  getClientFiscalMissingFields(
    client({ fiscalAddress: null, address: 'Rua Legado' }),
  ).includes('número do endereço'),
);
assert.deepEqual(
  getClientFiscalMissingFields(
    client({
      fiscalAddress: {
        street: null,
        number: '10',
        complement: null,
        neighborhood: null,
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01310100',
        cityCode: null,
      },
      address: 'Rua Legado',
    }),
    {
      cep: '01310100',
      logradouro: 'Rua Legado',
      complemento: '',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
    },
  ).filter((field) => field === 'bairro' || field === 'código IBGE'),
  [],
);

const companyMissing = getCompanyFiscalMissingFields(null);
assert.ok(companyMissing.includes('razão social'));
assert.ok(getCompanyCadastroMissingFields(null).includes('razão social'));
assert.equal(
  getCompanyCadastroMissingFields(null).includes('série RPS'),
  false,
);

const company = {
  legalName: 'Empresa Ltda',
  federalTaxNumber: '12345678000190',
  email: 'fiscal@empresa.com',
  taxRegime: 'SIMPLES_NACIONAL',
  address: {
    street: 'Rua A',
    number: '10',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310100',
    cityCode: '3550308',
    complement: null,
  },
  economicActivities: [{ code: '6201500', isMain: true }],
  federalServiceCode: '01.01',
  rpsSeries: '1',
  rpsNumber: 1,
  cityProviderOptions: { nbsCode: true, federalServiceCode: true },
  spedySyncStatus: SpedySyncStatusEnum.PENDING,
} as unknown as CompanyFiscalConfig;

assert.ok(getCompanyFiscalMissingFields(company).includes('código NBS'));
assert.equal(getCompanyCadastroMissingFields(company).length, 0);

const status = getCompanyFiscalStatus({
  ...company,
  nbsCode: '123',
  spedySyncStatus: SpedySyncStatusEnum.SYNCED,
  certificateUploadedAt: new Date(),
} as CompanyFiscalConfig);
assert.equal(status.readyForSync, true);
assert.equal(status.readyForEmission, true);
assert.equal(status.spedySyncStatus, 'SYNCED');
assert.equal(status.cityRequirements?.nbsCode, true);

console.log('fiscal-completeness.util.spec: ok');
