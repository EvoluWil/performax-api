export class SpedyCompanySettingsDto {
  environmentType: 'development' | 'production';
  serviceInvoice: {
    enabled: boolean;
    series?: string;
    number?: number;
  };
}
