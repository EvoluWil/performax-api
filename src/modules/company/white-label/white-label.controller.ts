import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { AdminOnly } from 'src/decorators/admin-only.decorator';
import { UpsertWhiteLabelDto } from './dto/upsert-white-label.dto';
import { WhiteLabelService } from './white-label.service';

@Controller('companies/:companyId/white-label')
export class WhiteLabelController {
  constructor(private readonly whiteLabelService: WhiteLabelService) {}

  @Get()
  get(@Param('companyId') companyId: string) {
    return this.whiteLabelService.get(companyId);
  }

  @AdminOnly()
  @Put()
  upsert(
    @Param('companyId') companyId: string,
    @Body() dto: UpsertWhiteLabelDto,
  ) {
    return this.whiteLabelService.upsert(companyId, dto);
  }

  @AdminOnly()
  @Delete()
  remove(@Param('companyId') companyId: string) {
    return this.whiteLabelService.remove(companyId);
  }
}
