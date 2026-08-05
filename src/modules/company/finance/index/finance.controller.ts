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
import { AdminOnly } from 'src/decorators/admin-only.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { FinanceService } from './finance.service';

@Controller('companies/:companyId/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  create(
    @Body() createFinanceDto: CreateFinanceDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.financeService.create(createFinanceDto, user?.id, companyId);
  }

  @Post('transfer')
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
  update(
    @Param('financeId') financeId: string,
    @Param('companyId') companyId: string,
    @Body() updateFinanceDto: UpdateFinanceDto,
  ) {
    return this.financeService.update(financeId, companyId, updateFinanceDto);
  }

  @Put(':financeId/revert-payment')
  revertPayment(
    @Param('financeId') financeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.financeService.revertPayment(financeId, companyId);
  }

  @Delete(':financeId')
  remove(
    @Param('financeId') financeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.financeService.remove(financeId, companyId);
  }

  @AdminOnly()
  @Put(':financeId/approve')
  approve(
    @Param('financeId') financeId: string,
    @Param('companyId') companyId: string,
    @Body('approved') approved: boolean,
  ) {
    return this.financeService.approve(financeId, companyId, approved);
  }
}
