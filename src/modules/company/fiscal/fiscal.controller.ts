import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AdminOnly } from 'src/decorators/admin-only.decorator';
import {
  SyncFiscalConfigDto,
  UpsertFiscalConfigDto,
} from './dto/upsert-fiscal-config.dto';
import { FiscalSpedySyncService } from './fiscal-spedy-sync.service';
import { FiscalService } from './fiscal.service';

@AdminOnly()
@Controller('companies/:companyId/fiscal-config')
export class FiscalController {
  constructor(
    private readonly fiscalService: FiscalService,
    private readonly syncService: FiscalSpedySyncService,
  ) {}

  @Get()
  get(@Param('companyId') companyId: string) {
    return this.fiscalService.get(companyId);
  }

  @Get('status')
  getStatus(@Param('companyId') companyId: string) {
    return this.fiscalService.getStatus(companyId);
  }

  @Get('cities')
  getCities(
    @Param('companyId') companyId: string,
    @Query('code') code?: string,
  ) {
    return this.syncService.getCities(companyId, code);
  }

  @Put()
  upsert(
    @Param('companyId') companyId: string,
    @Body() dto: UpsertFiscalConfigDto,
  ) {
    return this.fiscalService.upsert(companyId, dto);
  }

  @Post('sync')
  sync(
    @Param('companyId') companyId: string,
    @Body() dto: SyncFiscalConfigDto,
  ) {
    return this.syncService.sync(companyId, dto);
  }
}
