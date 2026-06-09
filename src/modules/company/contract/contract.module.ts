import { Module } from '@nestjs/common';
import { RecurringModule } from '../finance/recurring/recurring.module';
import { ContractController } from './index/contract.controller';
import { ContractService } from './index/contract.service';
import { TypeModule } from './type/type.module';

@Module({
  controllers: [ContractController],
  providers: [ContractService],
  imports: [TypeModule, RecurringModule],
})
export class ContractModule {}
