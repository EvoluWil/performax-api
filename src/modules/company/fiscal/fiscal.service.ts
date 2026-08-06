import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import {
  getCompanyFiscalStatus,
  FiscalStatus,
} from 'src/utils/fiscal-completeness.util';
import { UpsertFiscalConfigDto } from './dto/upsert-fiscal-config.dto';
import { FiscalConfigEntity } from './entities/fiscal-config.entity';

@Injectable()
export class FiscalService {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(
    config: NonNullable<
      Awaited<ReturnType<PrismaService['companyFiscalConfig']['findUnique']>>
    >,
  ): FiscalConfigEntity {
    const {
      certificatePassword,
      certificateFileBase64,
      spedyApiKey,
      ...rest
    } = config;

    return {
      ...rest,
      hasSpedyApiKey: !!spedyApiKey,
      hasCertificate: !!certificateFileBase64,
      hasCertificatePassword: !!certificatePassword,
    };
  }

  async get(companyId: string): Promise<FiscalConfigEntity | null> {
    const config = await this.prisma.companyFiscalConfig.findUnique({
      where: { companyId },
    });
    return config ? this.toEntity(config) : null;
  }

  async getStatus(companyId: string): Promise<FiscalStatus> {
    const config = await this.prisma.companyFiscalConfig.findUnique({
      where: { companyId },
    });
    return getCompanyFiscalStatus(config);
  }

  async upsert(companyId: string, dto: UpsertFiscalConfigDto) {
    const { certificatePassword, ...data } = dto;

    const updateData: Record<string, unknown> = { ...data };

    if (certificatePassword !== undefined) {
      updateData.certificatePassword = certificatePassword
        ? await bcrypt.hash(certificatePassword, 10)
        : null;
    }

    const existing = await this.prisma.companyFiscalConfig.findUnique({
      where: { companyId },
    });

    if (existing) {
      const updated = await this.prisma.companyFiscalConfig.update({
        where: { companyId },
        data: updateData,
      });
      return this.toEntity(updated);
    }

    const created = await this.prisma.companyFiscalConfig.create({
      data: {
        ...updateData,
        company: { connect: { id: companyId } },
      },
    });
    return this.toEntity(created);
  }
}
