import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SpedyService } from 'src/providers/spedy/spedy.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { getCompanyCadastroMissingFields } from 'src/utils/fiscal-completeness.util';
import {
  mapCompanySettings,
  mapCompanyToSpedy,
} from 'src/utils/spedy-mapper.util';
import { SyncFiscalConfigDto } from './dto/upsert-fiscal-config.dto';
import { FiscalService } from './fiscal.service';

@Injectable()
export class FiscalSpedySyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fiscalService: FiscalService,
    private readonly spedy: SpedyService,
  ) {}

  async getCities(companyId: string, code?: string) {
    if (!this.spedy.isConfigured()) {
      throw new BadRequestException(
        'Emissor indisponível. Contate o suporte.',
      );
    }

    const config = await this.fiscalService.getRaw(companyId);
    const ibge = code || config?.address?.cityCode;
    if (!ibge) {
      throw new BadRequestException('Informe o código IBGE da empresa');
    }

    const city = await this.spedy.getServiceInvoiceCities(
      ibge,
      config?.spedyApiKey || undefined,
    );
    if (city?.provider?.options && config) {
      await this.prisma.companyFiscalConfig.update({
        where: { companyId },
        data: {
          cityProviderOptions: city.provider.options as Prisma.InputJsonValue,
        },
      });
    }

    return {
      city,
      options: city?.provider?.options ?? config?.cityProviderOptions ?? null,
    };
  }

  async sync(companyId: string, dto: SyncFiscalConfigDto = {}) {
    if (!this.spedy.isConfigured()) {
      throw new BadRequestException(
        'Emissor indisponível. Contate o suporte.',
      );
    }

    const config = await this.fiscalService.getRaw(companyId);
    if (!config) {
      throw new BadRequestException('Salve o cadastro fiscal antes de sincronizar');
    }

    const missing = getCompanyCadastroMissingFields(config);
    if (missing.length) {
      throw new BadRequestException(
        `Cadastro da empresa incompleto: ${missing.join(', ')}`,
      );
    }

    try {
      if (config.address?.cityCode) {
        await this.getCities(companyId, config.address.cityCode);
      }

      const payload = mapCompanyToSpedy(config);
      const response = config.spedyCompanyId
        ? await this.spedy.updateCompany(config.spedyCompanyId, payload)
        : await this.spedy.createCompany(payload);

      const spedyCompanyId = response.id || config.spedyCompanyId;
      const spedyApiKey =
        response.apiCredentials?.apiKey || config.spedyApiKey || undefined;

      await this.prisma.companyFiscalConfig.update({
        where: { companyId },
        data: {
          spedyCompanyId,
          ...(spedyApiKey ? { spedyApiKey } : {}),
        },
      });

      const certificateBase64 = dto.certificateFileBase64;
      const certificatePassword = dto.certificatePassword;
      if (certificateBase64 && certificatePassword && spedyCompanyId) {
        const file = Buffer.from(certificateBase64, 'base64');
        await this.spedy.uploadCertificate(
          spedyCompanyId,
          file,
          dto.certificateFileName || 'certificado.pfx',
          certificatePassword,
        );
        await this.prisma.companyFiscalConfig.update({
          where: { companyId },
          data: {
            certificateFileName: dto.certificateFileName || 'certificado.pfx',
            certificateFileBase64: null,
            certificatePassword: null,
            certificateUploadedAt: new Date(),
          },
        });
      }

      const refreshed = await this.fiscalService.getRaw(companyId);
      if (spedyCompanyId && refreshed) {
        await this.spedy.updateCompanySettings(
          spedyCompanyId,
          mapCompanySettings(refreshed),
          spedyApiKey,
        );
      }

      const synced = await this.prisma.companyFiscalConfig.update({
        where: { companyId },
        data: {
          spedySyncStatus: 'SYNCED',
          spedySyncError: null,
          spedySyncedAt: new Date(),
        },
      });

      return this.fiscalService.toEntity(synced);
    } catch (err) {
      const message =
        err instanceof BadRequestException
          ? err.message
          : 'Falha ao habilitar o emissor';
      await this.prisma.companyFiscalConfig.update({
        where: { companyId },
        data: {
          spedySyncStatus: 'ERROR',
          spedySyncError: message,
        },
      });
      throw err;
    }
  }
}
