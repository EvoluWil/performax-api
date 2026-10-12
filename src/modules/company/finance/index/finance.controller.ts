import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { FinanceService } from './finance.service';

@Controller('companies/:companyId/finance')
@RequirePermission('financial', 'READ')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @RequirePermission('financial', 'WRITE')
  create(
    @Body() createFinanceDto: CreateFinanceDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.financeService.create(createFinanceDto, user?.id, companyId);
  }

  @Post('transfer')
  @RequirePermission('financial', 'WRITE')
  transfer(
    @Body() createTransferDto: CreateTransferDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.financeService.transfer(createTransferDto, companyId, user?.id);
  }

  @Get()
  findAll(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.financeService.findAll(companyId, user.id);
  }

  @Get(':financeId')
  findOne(
    @Param('financeId') financeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.financeService.findOne(financeId, companyId);
  }

  @Put(':financeId')
  @RequirePermission('financial', 'WRITE')
  update(
    @Param('financeId') financeId: string,
    @Param('companyId') companyId: string,
    @Body() updateFinanceDto: UpdateFinanceDto,
  ) {
    return this.financeService.update(financeId, companyId, updateFinanceDto);
  }

  @Put(':financeId/revert-payment')
  @RequirePermission('financial', 'WRITE')
  revertPayment(
    @Param('financeId') financeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.financeService.revertPayment(financeId, companyId);
  }

  @Delete(':financeId')
  @RequirePermission('financial', 'ADMIN')
  remove(
    @Param('financeId') financeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.financeService.remove(financeId, companyId);
  }

  @Put(':financeId/approve')
  @RequirePermission('financial', 'ADMIN')
  approve(
    @Param('financeId') financeId: string,
    @Param('companyId') companyId: string,
    @Body('approved') approved: boolean,
  ) {
    return this.financeService.approve(financeId, companyId, approved);
  }
}
