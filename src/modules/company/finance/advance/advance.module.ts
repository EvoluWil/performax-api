import { Module } from '@nestjs/common';
import { WalletModule } from '../wallet/wallet.module';
import { AdvanceController } from './advance.controller';
import { AdvanceService } from './advance.service';

@Module({
  imports: [WalletModule],
  controllers: [AdvanceController],
  providers: [AdvanceService],
  exports: [AdvanceService],
})
export class AdvanceModule {}
