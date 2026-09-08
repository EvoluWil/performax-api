import { Injectable } from '@nestjs/common';
import { CompanyFiscalConfig, FiscalAddress, Prisma } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import {
  FiscalStatus,
  getCompanyFiscalStatus,
} from 'src/utils/fiscal-completeness.util';
import { UpsertFiscalConfigDto } from './dto/upsert-fiscal-config.dto';
import { FiscalConfigEntity } from './entities/fiscal-config.entity';

function omitEmpty<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

function mergeAddress(
  current: FiscalAddress | null,
  next?: Partial<FiscalAddress>,
): FiscalAddress | undefined {
  if (!next) return undefined;
  return {
    street: next.street ?? current?.street ?? null,
    number: next.number ?? current?.number ?? null,
    complement: next.complement ?? current?.complement ?? null,
    neighborhood: next.neighborhood ?? current?.neighborhood ?? null,
    city: next.city ?? current?.city ?? null,
    state: next.state ?? current?.state ?? null,
    postalCode: next.postalCode ?? current?.postalCode ?? null,
    cityCode: next.cityCode ?? current?.cityCode ?? null,
  };
}

@Injectable()
export class FiscalService {
  constructor(private readonly prisma: PrismaService) {}

  toEntity(config: CompanyFiscalConfig): FiscalConfigEntity {
    const {
      certificatePassword,
      certificateFileBase64,
      spedyApiKey,
      taxLocation: _taxLocation,
      ...rest
    } = config;

    return {
      ...rest,
      hasSpedyApiKey: !!spedyApiKey,
      hasCertificate: !!config.certificateUploadedAt || !!certificateFileBase64,
      hasCertificatePassword: !!certificatePassword,
    };
  }

  async get(companyId: string): Promise<FiscalConfigEntity | null> {
    const config = await this.prisma.companyFiscalConfig.findUnique({
      where: { companyId },
    });
    return config ? this.toEntity(config) : null;
  }

  async getRaw(companyId: string) {
    return this.prisma.companyFiscalConfig.findUnique({
      where: { companyId },
    });
  }

  async getStatus(companyId: string): Promise<FiscalStatus> {
    const config = await this.prisma.companyFiscalConfig.findUnique({
      where: { companyId },
    });
    return getCompanyFiscalStatus(config);
  }

  async upsert(companyId: string, dto: UpsertFiscalConfigDto) {
    const existing = await this.prisma.companyFiscalConfig.findUnique({
      where: { companyId },
    });

    const {
      economicActivities,
      address,
      federalTaxNumber,
      environmentType: _environmentType,
      ...rest
    } = dto;

    delete (rest as { taxLocation?: unknown }).taxLocation;

    const data: Record<string, unknown> = {
      ...omitEmpty({
        ...rest,
        federalTaxNumber: federalTaxNumber
          ? federalTaxNumber.replace(/\D/g, '')
          : undefined,
      }),
    };

    if (address) {
      data.address = mergeAddress(existing?.address ?? null, address);
    }

    if (economicActivities?.some((item) => item.code?.trim())) {
      data.economicActivities = economicActivities
        .filter((item) => item.code?.trim())
        .map((item) => ({
          code: item.code.trim(),
          isMain: item.isMain === true || String(item.isMain) === 'true',
        }));
    }

    if (existing) {
      const updated = await this.prisma.companyFiscalConfig.update({
        where: { companyId },
        data: data as Prisma.CompanyFiscalConfigUpdateInput,
      });
      return this.toEntity(updated);
    }

    const created = await this.prisma.companyFiscalConfig.create({
      data: {
        ...(data as Prisma.CompanyFiscalConfigUncheckedCreateInput),
        companyId,
      },
    });
    return this.toEntity(created);
  }
}
