export interface SpedyCompanyResponse {
  id: string;
  name: string;
  legalName: string;
  federalTaxNumber: string;
  taxRegime: string;
  apiCredentials?: {
    apiKey: string;
  };
}

export interface SpedyCityProviderOptions {
  rps?: boolean;
  series?: boolean;
  batchNumber?: boolean;
  invoiceNumber?: boolean;
  federalServiceCode?: boolean;
  nbsCode?: boolean;
  authentication?: string;
}

export interface SpedyCityItem {
  id: string;
  code: string;
  name: string;
  state: string;
  provider?: {
    name?: string;
    options?: SpedyCityProviderOptions;
  };
}

export interface SpedyServiceInvoicePayload {
  effectiveDate: string;
  status: 'enqueued';
  sendEmailToCustomer: boolean;
  integrationId: string;
  description: string;
  federalServiceCode?: string;
  cityServiceCode?: string;
  nbsCode?: string;
  taxationType?: string;
  receiver: {
    name: string;
    federalTaxNumber: string;
    email?: string;
    address: {
      street: string;
      number: string;
      district: string;
      postalCode: string;
      additionalInformation?: string;
      city: { code?: string; name: string; state: string };
    };
  };
  total: {
    invoiceAmount: number;
    issRate?: number;
    issAmount?: number;
    issWithheld?: boolean;
  };
}

export interface SpedyServiceInvoiceResponse {
  id: string;
  integrationId?: string;
  status?: string;
  number?: number | string | null;
  issuedOn?: string | null;
  amount?: number;
  processingDetail?: { status?: string; message?: string | null };
}

export interface SpedyPagedResponse<T> {
  items: T[];
  totalCount: number;
  pageCount: number;
  pageSize: number;
  hasNext: boolean;
}
