import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { AdvanceService } from './advance.service';
import { CreateAdvanceDto } from './dto/create-advance.dto';

@Controller('companies/:companyId/finance-advance')
@RequirePermission('financial', 'READ')
export class AdvanceController {
  constructor(private readonly advanceService: AdvanceService) {}

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.advanceService.findAll(companyId);
  }

  @Get(':advanceId')
  findOne(
    @Param('advanceId') advanceId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.advanceService.findOne(advanceId, companyId);
  }

  @Post()
  @RequirePermission('financial', 'WRITE')
  create(
    @Param('companyId') companyId: string,
    @Body() dto: CreateAdvanceDto,
    @Req() req: any,
  ) {
    return this.advanceService.create(dto, req.user.id, companyId);
  }

  @Delete(':advanceId')
  @RequirePermission('financial', 'ADMIN')
  remove(
    @Param('advanceId') advanceId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.advanceService.remove(advanceId, companyId);
  }
}
