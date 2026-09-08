import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import FormData = require('form-data');
import { CreateSpedyCompanyDto } from './dto/create-company.dto';
import { SpedyCompanySettingsDto } from './dto/company-settings.dto';
import {
  SpedyCityItem,
  SpedyCompanyResponse,
  SpedyPagedResponse,
  SpedyServiceInvoicePayload,
  SpedyServiceInvoiceResponse,
} from './types/spedy.types';

@Injectable()
export class SpedyService {
  private readonly logger = new Logger(SpedyService.name);
  private readonly baseUrl: string;
  private readonly ownerApiKey: string;

  constructor() {
    this.baseUrl =
      process.env.SPEDY_BASE_URL ?? 'https://sandbox-api.spedy.com.br/v1';
    this.ownerApiKey = process.env.SPEDY_OWNER_API_KEY ?? '';
  }

  isConfigured(): boolean {
    return !!this.baseUrl && !!this.ownerApiKey;
  }

  private headers(apiKey = this.ownerApiKey): Record<string, string> {
    return { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' };
  }

  private handleError(err: unknown): never {
    const response = (err as { response?: { status?: number; data?: { errors?: { message: string }[] } } })
      ?.response;
    const errors = response?.data?.errors;
    if (errors?.length) {
      const message = errors
        .map((item) => item.message.replace(/spedy/gi, 'emissor'))
        .join('; ');
      throw new BadRequestException(message);
    }
    if (response?.status === 403) {
      throw new BadRequestException(
        'Não foi possível habilitar o emissor',
      );
    }
    if (response?.status === 429) {
      throw new BadRequestException(
        'Limite de requisições atingido. Tente novamente em breve',
      );
    }
    const message = (err as { message?: string })?.message;
    this.logger.error('Spedy API error', response?.data ?? message);
    throw new BadRequestException('Erro na comunicação com o emissor');
  }

  async createCompany(dto: CreateSpedyCompanyDto): Promise<SpedyCompanyResponse> {
    try {
      const { data } = await axios.post(`${this.baseUrl}/companies`, dto, {
        headers: this.headers(),
      } as AxiosRequestConfig);
      return data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateCompany(
    companyId: string,
    dto: CreateSpedyCompanyDto,
  ): Promise<SpedyCompanyResponse> {
    try {
      const { data } = await axios.put(
        `${this.baseUrl}/companies/${companyId}`,
        dto,
        { headers: this.headers() } as AxiosRequestConfig,
      );
      return data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getCompany(companyId: string): Promise<SpedyCompanyResponse> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/companies/${companyId}`, {
        headers: this.headers(),
      } as AxiosRequestConfig);
      return data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async uploadCertificate(
    companyId: string,
    file: Buffer,
    fileName: string,
    password: string,
  ): Promise<{ success: boolean }> {
    try {
      const form = new FormData();
      form.append('file', file, {
        filename: fileName,
        contentType: 'application/x-pkcs12',
      });
      form.append('password', password);
      const { data } = await axios.post(
        `${this.baseUrl}/companies/${companyId}/certificates`,
        form,
        {
          headers: {
            'X-Api-Key': this.ownerApiKey,
            ...form.getHeaders(),
          },
        } as AxiosRequestConfig,
      );
      return data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async updateCompanySettings(
    companyId: string,
    dto: SpedyCompanySettingsDto,
    apiKey?: string,
  ): Promise<unknown> {
    try {
      const { data } = await axios.put(
        `${this.baseUrl}/companies/${companyId}/settings`,
        dto,
        { headers: this.headers(apiKey || this.ownerApiKey) } as AxiosRequestConfig,
      );
      return data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getServiceInvoiceCities(
    code: string,
    apiKey?: string,
  ): Promise<SpedyCityItem | null> {
    try {
      const { data } = await axios.get<SpedyPagedResponse<SpedyCityItem>>(
        `${this.baseUrl}/service-invoices/cities`,
        {
          headers: this.headers(apiKey || this.ownerApiKey),
          params: { code, page: 1, pageSize: 5 },
        } as AxiosRequestConfig,
      );
      return data.items?.[0] ?? null;
    } catch (err) {
      this.handleError(err);
    }
  }

  async createServiceInvoice(
    dto: SpedyServiceInvoicePayload,
    apiKey: string,
  ): Promise<SpedyServiceInvoiceResponse> {
    try {
      const { data } = await axios.post(
        `${this.baseUrl}/service-invoices`,
        dto,
        { headers: this.headers(apiKey) } as AxiosRequestConfig,
      );
      return data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getServiceInvoice(
    invoiceId: string,
    apiKey: string,
  ): Promise<SpedyServiceInvoiceResponse> {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/service-invoices/${invoiceId}`,
        { headers: this.headers(apiKey) } as AxiosRequestConfig,
      );
      return data;
    } catch (err) {
      this.handleError(err);
    }
  }
}
