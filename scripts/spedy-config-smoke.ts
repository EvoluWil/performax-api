import 'dotenv/config';
import { mapCompanyToSpedy, mapTaxRegime } from '../src/utils/spedy-mapper.util';
import { TaxRegimeEnum } from '@prisma/client';

if (mapTaxRegime(TaxRegimeEnum.SIMPLES_NACIONAL) !== 'simplesNacional') {
  throw new Error('mapper de regime tributário inválido');
}

const payload = mapCompanyToSpedy({
  legalName: 'Empresa Teste Ltda',
  tradeName: 'Empresa Teste',
  federalTaxNumber: '12345678000195',
  email: 'fiscal@empresa.test',
  taxRegime: TaxRegimeEnum.SIMPLES_NACIONAL,
  address: {
    street: 'Rua Teste',
    number: '10',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310100',
    cityCode: '3550308',
    complement: null,
  },
  economicActivities: [{ code: '6201500', isMain: true }],
} as never);

if (!payload.address.city.code) {
  throw new Error('IBGE não mapeado');
}

if (!process.env.SPEDY_OWNER_API_KEY) {
  console.log(
    'Smoke local ok. Defina SPEDY_OWNER_API_KEY para validar a chamada sandbox.',
  );
  process.exit(0);
}

console.log(
  'Smoke local ok. Sincronização remota depende do cadastro completo na tela Minha Empresa.',
);
