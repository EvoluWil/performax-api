import * as assert from 'node:assert/strict';
import {
  CompanyFiscalConfig,
  FiscalEnvironmentTypeEnum,
  SpedySyncStatusEnum,
  TaxRegimeEnum,
} from '@prisma/client';
import {
  mapCompanySettings,
  mapCompanyToSpedy,
  mapEnvironmentType,
  mapTaxRegime,
} from './spedy-mapper.util';

assert.equal(mapTaxRegime(TaxRegimeEnum.SIMPLES_NACIONAL), 'simplesNacional');
assert.equal(
  mapTaxRegime(TaxRegimeEnum.SIMPLES_NACIONAL_EXCESSO),
  'simplesNacionalExcessoSublimite',
);
assert.equal(mapTaxRegime(TaxRegimeEnum.SIMPLES_NACIONAL_MEI), 'simplesNacionalMEI');
assert.equal(mapTaxRegime(TaxRegimeEnum.REGIME_NORMAL), 'regimeNormal');

const config = {
  legalName: 'Empresa Ltda',
  tradeName: 'Fantasia',
  federalTaxNumber: '12.345.678/0001-90',
  email: 'fiscal@empresa.com',
  taxRegime: TaxRegimeEnum.SIMPLES_NACIONAL,
  environmentType: FiscalEnvironmentTypeEnum.DEVELOPMENT,
  spedySyncStatus: SpedySyncStatusEnum.PENDING,
  rpsSeries: 'A',
  rpsNumber: 12,
  address: {
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    cityCode: '3550308',
    complement: null,
  },
  economicActivities: [{ code: '6201500', isMain: true }],
} as CompanyFiscalConfig;

const payload = mapCompanyToSpedy(config);
assert.equal(payload.taxRegime, 'simplesNacional');
assert.equal(payload.federalTaxNumber, '12345678000190');
assert.equal(payload.address.city.code, '3550308');
assert.equal(payload.address.district, 'Bela Vista');
assert.equal(payload.name, 'Fantasia');

const settings = mapCompanySettings(config);
assert.equal(settings.environmentType, 'development');
assert.equal(settings.serviceInvoice.series, 'A');
assert.equal(settings.serviceInvoice.number, 12);

assert.equal(mapEnvironmentType('production'), 'production');
assert.equal(mapEnvironmentType('DEVELOPMENT'), 'development');

console.log('spedy-mapper.util.spec: ok');
