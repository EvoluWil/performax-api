import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AdvanceService } from './advance.service';
import { CreateAdvanceDto } from './dto/create-advance.dto';

@Controller('companies/:companyId/finance-advance')
export class AdvanceController {
  constructor(private readonly advanceService: AdvanceService) {}

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.advanceService.findAll(companyId);
  }

  @Get('available')
  findAvailable(@Param('companyId') companyId: string) {
    return this.advanceService.findAvailable(companyId);
  }

  @Get(':advanceId')
  findOne(
    @Param('advanceId') advanceId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.advanceService.findOne(advanceId, companyId);
  }

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() dto: CreateAdvanceDto,
    @Req() req: any,
  ) {
    return this.advanceService.create(dto, req.user.id, companyId);
  }

  @Delete(':advanceId')
  remove(
    @Param('advanceId') advanceId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.advanceService.remove(advanceId, companyId);
  }
}
