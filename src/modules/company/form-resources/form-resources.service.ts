import { Injectable } from '@nestjs/common';
import { CompanyPermissionService } from 'src/providers/permission/company-permission.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { FORM_RESOURCE_MODULE_MAP } from 'src/utils/form-resource-modules.util';
import { FormResourcesDto, ResourceKey } from './dto/form-resources.dto';

type ResourceItem = { id: string; name: string; [key: string]: unknown };

@Injectable()
export class FormResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: CompanyPermissionService,
  ) {}

  async findResources(
    companyId: string,
    userId: string,
    dto: FormResourcesDto,
  ): Promise<Partial<Record<ResourceKey, ResourceItem[]>>> {
    const ctx = await this.permissionService.resolveContext(userId, companyId);
    const { resources, search = {} } = dto;
    const result: Partial<Record<ResourceKey, ResourceItem[]>> = {};

    await Promise.all(
      resources.map(async (resource) => {
        const moduleCode = FORM_RESOURCE_MODULE_MAP[resource];
        if (!this.permissionService.hasFilterAccess(ctx, moduleCode)) {
          result[resource] = [];
          return;
        }

        const term = search[resource] ?? '';
        const nameFilter = term
          ? { contains: term, mode: 'insensitive' as const }
          : undefined;

        switch (resource) {
          case 'users': {
            const where: Record<string, unknown> = {
              deleted: false,
              companyUser: { some: { companyId } },
              ...(nameFilter ? { name: nameFilter } : {}),
            };
            this.permissionService.applyUserIdsScopeToWhere(
              where,
              ctx,
              'user',
              'id',
            );
            const users = await this.prisma.user.findMany({
              where: where as any,
              select: { id: true, name: true },
              orderBy: { name: 'asc' },
            });
            result.users = users;
            break;
          }

          case 'clients': {
            const where: Record<string, unknown> = {
              companyId,
              deleted: false,
              ...(nameFilter ? { name: nameFilter } : {}),
            };
            await this.permissionService.applyClientScopeToWhere(
              where,
              ctx,
              'client',
            );
            const clients = await this.prisma.companyClient.findMany({
              where: where as any,
              select: { id: true, name: true },
              orderBy: { name: 'asc' },
            });
            result.clients = clients;
            break;
          }

          case 'financeTypes': {
            const types = await this.prisma.companyFinanceType.findMany({
              where: {
                companyId,
                deleted: false,
                ...(nameFilter ? { name: nameFilter } : {}),
              },
              select: { id: true, name: true, needApprove: true },
              orderBy: { name: 'asc' },
            });
            result.financeTypes = types;
            break;
          }

          case 'financeBanks': {
            const banks = await this.prisma.companyFinanceBank.findMany({
              where: {
                companyId,
                deleted: false,
                ...(nameFilter ? { name: nameFilter } : {}),
              },
              select: { id: true, name: true, code: true },
              orderBy: { name: 'asc' },
            });
            result.financeBanks = banks;
            break;
          }

          case 'financeCategories': {
            const categories =
              await this.prisma.companyFinanceCategory.findMany({
                where: {
                  companyId,
                  deleted: false,
                  ...(nameFilter ? { name: nameFilter } : {}),
                },
                select: { id: true, name: true },
                orderBy: { name: 'asc' },
              });
            result.financeCategories = categories;
            break;
          }

          case 'financeSegments': {
            const segments = await this.prisma.companyFinanceSegment.findMany({
              where: {
                companyId,
                deleted: false,
                ...(nameFilter ? { name: nameFilter } : {}),
              },
              select: { id: true, name: true },
              orderBy: { name: 'asc' },
            });
            result.financeSegments = segments;
            break;
          }

          case 'financePayees': {
            const payees = await this.prisma.companyFinancePayee.findMany({
              where: {
                companyId,
                deleted: false,
                ...(nameFilter ? { name: nameFilter } : {}),
              },
              select: { id: true, name: true },
              orderBy: { name: 'asc' },
            });
            result.financePayees = payees;
            break;
          }

          case 'financePaymentMethods': {
            const methods =
              await this.prisma.companyFinancePaymentMethod.findMany({
                where: {
                  companyId,
                  deleted: false,
                  ...(nameFilter ? { name: nameFilter } : {}),
                },
                select: { id: true, name: true },
                orderBy: { name: 'asc' },
              });
            result.financePaymentMethods = methods;
            break;
          }

          case 'taskTypes': {
            const taskTypes = await this.prisma.companyTaskType.findMany({
              where: {
                companyId,
                deleted: false,
                ...(nameFilter ? { name: nameFilter } : {}),
              },
              select: { id: true, name: true },
              orderBy: { name: 'asc' },
            });
            result.taskTypes = taskTypes;
            break;
          }

          case 'employees': {
            const employees = await this.prisma.companyEmployee.findMany({
              where: {
                companyId,
                deleted: false,
                ...(nameFilter ? { name: nameFilter } : {}),
              },
              select: { id: true, name: true },
              orderBy: { name: 'asc' },
            });
            result.employees = employees;
            break;
          }

          case 'budgetTypes': {
            const budgetTypes = await this.prisma.companyBudgetType.findMany({
              where: {
                companyId,
                deleted: false,
                ...(nameFilter ? { name: nameFilter } : {}),
              },
              select: { id: true, name: true, needApprove: true },
              orderBy: { name: 'asc' },
            });
            result.budgetTypes = budgetTypes;
            break;
          }

          case 'occurrenceTypes': {
            const occurrenceTypes =
              await this.prisma.companyOccurrenceType.findMany({
                where: {
                  companyId,
                  deleted: false,
                  ...(nameFilter ? { name: nameFilter } : {}),
                },
                select: { id: true, name: true, needApprove: true },
                orderBy: { name: 'asc' },
              });
            result.occurrenceTypes = occurrenceTypes;
            break;
          }

          case 'contractTypes': {
            const contractTypes = await this.prisma.companyContractType.findMany(
              {
                where: {
                  companyId,
                  deleted: false,
                  ...(nameFilter ? { name: nameFilter } : {}),
                },
                select: { id: true, name: true },
                orderBy: { name: 'asc' },
              },
            );
            result.contractTypes = contractTypes;
            break;
          }
        }
      }),
    );

    return result;
  }
}
