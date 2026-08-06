import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AdminOnly } from 'src/decorators/admin-only.decorator';
import { UpsertFiscalConfigDto } from './dto/upsert-fiscal-config.dto';
import { FiscalService } from './fiscal.service';

@Controller('companies/:companyId/fiscal-config')
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Get()
  get(@Param('companyId') companyId: string) {
    return this.fiscalService.get(companyId);
  }

  @Get('status')
  getStatus(@Param('companyId') companyId: string) {
    return this.fiscalService.getStatus(companyId);
  }

  @AdminOnly()
  @Put()
  upsert(
    @Param('companyId') companyId: string,
    @Body() dto: UpsertFiscalConfigDto,
  ) {
    return this.fiscalService.upsert(companyId, dto);
  }
}
