export class SpedyCityDto {
  code?: string | number;
  name?: string;
  state?: string;
}

export class SpedyAddressDto {
  street: string;
  district: string;
  postalCode: string;
  number: string;
  additionalInformation?: string;
  city: SpedyCityDto;
  country?: string;
}

export class SpedyEconomicActivityDto {
  code: string;
  isMain: boolean;
}

export class CreateSpedyCompanyDto {
  name: string;
  legalName: string;
  federalTaxNumber: string;
  stateTaxNumber?: string;
  cityTaxNumber?: string;
  email: string;
  phone?: string;
  address: SpedyAddressDto;
  taxRegime:
    | 'simplesNacional'
    | 'simplesNacionalExcessoSublimite'
    | 'simplesNacionalMEI'
    | 'regimeNormal';
  economicActivities: SpedyEconomicActivityDto[];
}
