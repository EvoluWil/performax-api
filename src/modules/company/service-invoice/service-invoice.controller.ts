import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FinanceStatusEnum, User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CompanyPermissionService } from 'src/providers/permission/company-permission.service';
import { ServiceInvoiceService } from './service-invoice.service';

@Controller('companies/:companyId/service-invoices')
export class ServiceInvoiceController {
  constructor(
    private readonly service: ServiceInvoiceService,
    private readonly permissionService: CompanyPermissionService,
  ) {}

  @Get()
  async list(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('invoiceStatus') invoiceStatus?: string,
    @Query('financeStatus') financeStatus?: FinanceStatusEnum,
  ) {
    await this.assertRead(user.id, companyId);
    return this.service.list(
      companyId,
      new Date(from),
      new Date(to),
      invoiceStatus || undefined,
      financeStatus,
    );
  }

  @Post()
  async issue(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Body()
    body: { clientId: string; from: string; to: string; financeStatus?: FinanceStatusEnum },
  ) {
    await this.assertWrite(user.id, companyId);
    return this.service.issueOne(
      companyId,
      body.clientId,
      {
        periodStart: new Date(body.from),
        periodEnd: new Date(body.to),
        financeStatus: body.financeStatus,
      },
      'MANUAL',
    );
  }

  @Post('batch')
  async issueBatch(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Body()
    body: {
      from: string;
      to: string;
      financeStatus?: FinanceStatusEnum;
      clientIds?: string[];
    },
  ) {
    await this.assertWrite(user.id, companyId);
    return this.service.issueBatch(companyId, {
      periodStart: new Date(body.from),
      periodEnd: new Date(body.to),
      financeStatus: body.financeStatus,
      clientIds: body.clientIds,
    });
  }

  private async assertRead(userId: string, companyId: string) {
    await this.permissionService.assertCompanyHasModule(companyId, 'fiscal');
    const ctx = await this.permissionService.resolveContext(userId, companyId);
    this.permissionService.assertPageAccess(ctx, 'fiscal');
  }

  private async assertWrite(userId: string, companyId: string) {
    await this.permissionService.assertCompanyHasModule(companyId, 'fiscal');
    const ctx = await this.permissionService.resolveContext(userId, companyId);
    this.permissionService.assertWriteAccess(ctx, 'fiscal');
  }
}
