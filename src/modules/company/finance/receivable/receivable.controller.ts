import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CreateReceivableDto } from './dto/create-receivable.dto';
import { ReceivableService } from './receivable.service';

@Controller('companies/:companyId/finance-receivable')
export class ReceivableController {
  constructor(private readonly receivableService: ReceivableService) {}

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.receivableService.findAll(companyId);
  }

  @Get(':receivableId')
  findOne(
    @Param('receivableId') receivableId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.receivableService.findOne(receivableId, companyId);
  }

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() dto: CreateReceivableDto,
    @Req() req: any,
  ) {
    return this.receivableService.create(dto, req.user.id, companyId);
  }

  @Delete(':receivableId')
  remove(
    @Param('receivableId') receivableId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.receivableService.remove(receivableId, companyId);
  }
}
