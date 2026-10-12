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
import { CreateReceivableDto } from './dto/create-receivable.dto';
import { ReceivableService } from './receivable.service';

@Controller('companies/:companyId/finance-receivable')
@RequirePermission('financial', 'READ')
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
  @RequirePermission('financial', 'WRITE')
  create(
    @Param('companyId') companyId: string,
    @Body() dto: CreateReceivableDto,
    @Req() req: any,
  ) {
    return this.receivableService.create(dto, req.user.id, companyId);
  }

  @Delete(':receivableId')
  @RequirePermission('financial', 'ADMIN')
  remove(
    @Param('receivableId') receivableId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.receivableService.remove(receivableId, companyId);
  }
}
