import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { FormResourcesDto, ResourceKey } from './dto/form-resources.dto';

type ResourceItem = { id: string; name: string; [key: string]: unknown };

@Injectable()
export class FormResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async findResources(
    companyId: string,
    dto: FormResourcesDto,
  ): Promise<Partial<Record<ResourceKey, ResourceItem[]>>> {
    const { resources, search = {} } = dto;
    const result: Partial<Record<ResourceKey, ResourceItem[]>> = {};

    await Promise.all(
      resources.map(async (resource) => {
        const term = search[resource] ?? '';
        const nameFilter = term
          ? { contains: term, mode: 'insensitive' as const }
          : undefined;

        switch (resource) {
          case 'users': {
            const users = await this.prisma.user.findMany({
              where: {
                deleted: false,
                companyUser: { some: { companyId } },
                ...(nameFilter ? { name: nameFilter } : {}),
              },
              select: { id: true, name: true },
              take: 10,
              orderBy: { name: 'asc' },
            });
            result.users = users;
            break;
          }

          case 'clients': {
            const clients = await this.prisma.companyClient.findMany({
              where: {
                companyId,
                deleted: false,
                ...(nameFilter ? { name: nameFilter } : {}),
              },
              select: { id: true, name: true },
              take: 10,
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
              take: 10,
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
              take: 10,
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
                take: 10,
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
              take: 10,
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
              take: 10,
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
                take: 10,
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
              take: 10,
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
              take: 10,
              orderBy: { name: 'asc' },
            });
            result.employees = employees;
            break;
          }
        }
      }),
    );

    return result;
  }
}
