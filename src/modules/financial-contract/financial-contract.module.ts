import { Module } from '@nestjs/common';
import { FinancialContractService } from './financial-contract.service';
import { FinancialContractController } from './financial-contract.controller';

@Module({
  controllers: [FinancialContractController],
  providers: [FinancialContractService]
})
export class FinancialContractModule {}
