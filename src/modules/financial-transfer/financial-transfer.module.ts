import { Module } from '@nestjs/common';
import { FinancialTransferService } from './financial-transfer.service';
import { FinancialTransferController } from './financial-transfer.controller';

@Module({
  controllers: [FinancialTransferController],
  providers: [FinancialTransferService],
})
export class FinancialTransferModule {}
