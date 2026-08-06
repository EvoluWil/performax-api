import { Injectable, NotFoundException } from '@nestjs/common';
import { FinanceStatusEnum } from '@prisma/client';
import { CompanyPermissionService } from 'src/providers/permission/company-permission.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import {
  getClientFiscalStatus,
  mapClientForResponse,
} from 'src/utils/fiscal-completeness.util';
import { fetchViaCep } from 'src/utils/viacep.util';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

export type ClientComplianceStatus = {
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'NO_CONTRACTS';
  overdueCount: number;
};

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
    private readonly permissionService: CompanyPermissionService,
  ) {}

  create(createClientDto: CreateClientDto, companyId: string, userId: string) {
    return this.prisma.companyClient
      .create({
        data: {
          ...createClientDto,
          company: { connect: { id: companyId } },
          createdBy: { connect: { id: userId } },
        },
      })
      .then(mapClientForResponse);
  }

  async findAll(companyId: string, userId: string) {
    const ctx = await this.permissionService.resolveContext(userId, companyId);
    this.permissionService.assertFilterAccess(ctx, 'client');

    const where: Record<string, unknown> = { companyId, deleted: false };
    await this.permissionService.applyClientScopeToWhere(where, ctx, 'client');

    const { count, query } = await this.qb.query('companyClient', where);
    const clients = await this.prisma.companyClient.findMany({
      ...query,
    });

    return { count, data: clients.map(mapClientForResponse) };
  }

  async getComplianceStatus(
    clientId: string,
    companyId: string,
  ): Promise<ClientComplianceStatus> {
    const activeContracts = await this.prisma.companyContract.findMany({
      where: {
        clientId,
        companyId,
        deleted: false,
        active: true,
        recurringId: { not: null },
      },
      select: { recurringId: true },
    });

    const recurringIds = activeContracts
      .map((c) => c.recurringId)
      .filter((id): id is string => !!id);

    if (recurringIds.length === 0) {
      return { status: 'NO_CONTRACTS', overdueCount: 0 };
    }

    const now = new Date();
    const overdueCount = await this.prisma.companyFinance.count({
      where: {
        recurrenceMasterId: { in: recurringIds },
        date: { lt: now },
        status: {
          in: [FinanceStatusEnum.PENDING, FinanceStatusEnum.APPROVED],
        },
        deleted: false,
      },
    });

    return {
      status: overdueCount > 0 ? 'NON_COMPLIANT' : 'COMPLIANT',
      overdueCount,
    };
  }

  async findOne(clientId: string, companyId: string, userId?: string) {
    if (userId) {
      const ctx = await this.permissionService.resolveContext(userId, companyId);
      this.permissionService.assertPageAccess(ctx, 'client');
    }

    const client = await this.prisma.companyClient.findUnique({
      where: { id: clientId, companyId, deleted: false },
      include: {
        createdBy: { select: { id: true, name: true } },
        contracts: {
          where: { deleted: false },
          include: {
            type: {
              select: {
                id: true,
                name: true,
                lastAdjustmentPercentage: true,
                lastAdjustmentAt: true,
              },
            },
            createdBy: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const compliance = await this.getComplianceStatus(clientId, companyId);

    return { ...mapClientForResponse(client), compliance };
  }

  async getFiscalStatus(clientId: string, companyId: string) {
    const client = await this.prisma.companyClient.findUnique({
      where: { id: clientId, companyId, deleted: false },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const mapped = mapClientForResponse(client);
    const postalCode = mapped.fiscalAddress?.postalCode ?? '';
    const viaCep = await fetchViaCep(postalCode);

    return getClientFiscalStatus(mapped, viaCep);
  }

  async update(
    clientId: string,
    companyId: string,
    updateClientDto: UpdateClientDto,
  ) {
    await this.findOne(clientId, companyId);
    return this.prisma.companyClient
      .update({
        where: { id: clientId, companyId },
        data: updateClientDto,
      })
      .then(mapClientForResponse);
  }

  async remove(clientId: string, companyId: string) {
    await this.findOne(clientId, companyId);
    return this.prisma.companyClient.update({
      where: { id: clientId, companyId },
      data: { deleted: true },
    });
  }
}
