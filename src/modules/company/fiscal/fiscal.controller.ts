import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CompanyPermissionService } from 'src/providers/permission/company-permission.service';
import {
  SyncFiscalConfigDto,
  UpsertFiscalConfigDto,
} from './dto/upsert-fiscal-config.dto';
import { FiscalSpedySyncService } from './fiscal-spedy-sync.service';
import { FiscalService } from './fiscal.service';

@Controller('companies/:companyId/fiscal-config')
export class FiscalController {
  constructor(
    private readonly fiscalService: FiscalService,
    private readonly syncService: FiscalSpedySyncService,
    private readonly permissionService: CompanyPermissionService,
  ) {}

  @Get()
  async get(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    await this.assertRead(user.id, companyId);
    return this.fiscalService.get(companyId);
  }

  @Get('status')
  async getStatus(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    await this.assertRead(user.id, companyId);
    return this.fiscalService.getStatus(companyId);
  }

  @Get('cities')
  async getCities(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Query('code') code?: string,
  ) {
    await this.assertRead(user.id, companyId);
    return this.syncService.getCities(companyId, code);
  }

  @Put()
  async upsert(
    @Param('companyId') companyId: string,
    @Body() dto: UpsertFiscalConfigDto,
    @AuthUser() user: User,
  ) {
    await this.assertWrite(user.id, companyId);
    return this.fiscalService.upsert(companyId, dto);
  }

  @Post('sync')
  async sync(
    @Param('companyId') companyId: string,
    @Body() dto: SyncFiscalConfigDto,
    @AuthUser() user: User,
  ) {
    await this.assertWrite(user.id, companyId);
    return this.syncService.sync(companyId, dto);
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
