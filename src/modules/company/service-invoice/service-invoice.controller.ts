import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FinanceStatusEnum } from '@prisma/client';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { ServiceInvoiceService } from './service-invoice.service';

@Controller('companies/:companyId/service-invoices')
@RequirePermission('fiscal', 'READ')
export class ServiceInvoiceController {
  constructor(private readonly service: ServiceInvoiceService) {}

  @Get()
  list(
    @Param('companyId') companyId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('invoiceStatus') invoiceStatus?: string,
    @Query('financeStatus') financeStatus?: FinanceStatusEnum,
  ) {
    return this.service.list(
      companyId,
      new Date(from),
      new Date(to),
      invoiceStatus || undefined,
      financeStatus,
    );
  }

  @Post()
  @RequirePermission('fiscal', 'WRITE')
  issue(
    @Param('companyId') companyId: string,
    @Body()
    body: {
      clientId: string;
      from: string;
      to: string;
      financeStatus?: FinanceStatusEnum;
    },
  ) {
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
  @RequirePermission('fiscal', 'WRITE')
  issueBatch(
    @Param('companyId') companyId: string,
    @Body()
    body: {
      from: string;
      to: string;
      financeStatus?: FinanceStatusEnum;
      clientIds?: string[];
    },
  ) {
    return this.service.issueBatch(companyId, {
      periodStart: new Date(body.from),
      periodEnd: new Date(body.to),
      financeStatus: body.financeStatus,
      clientIds: body.clientIds,
    });
  }
}
