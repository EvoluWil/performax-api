import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AdminOnly } from 'src/decorators/admin-only.decorator';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletService } from './wallet.service';

@Controller('companies/:companyId/finance-wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  getWallet(@Param('companyId') companyId: string) {
    return this.walletService.getWallet(companyId);
  }

  @AdminOnly()
  @Post('recalculate')
  recalculate(@Param('companyId') companyId: string) {
    return this.walletService.recalculate(companyId);
  }

  @Post()
  create(
    @Body() createWalletDto: CreateWalletDto,
    @Param('companyId') companyId: string,
  ) {
    return this.walletService.create(createWalletDto, companyId);
  }

  @Put(':walletId')
  update(
    @Param('walletId') walletId: string,
    @Param('companyId') companyId: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletService.update(updateWalletDto, walletId, companyId);
  }
}
