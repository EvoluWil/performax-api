import { Module } from '@nestjs/common';
import { BankModule } from './bank/bank.module';
import { CategoryModule } from './category/category.module';
import { FinanceController } from './index/finance.controller';
import { FinanceService } from './index/finance.service';
import { PayeeModule } from './payee/payee.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { AdvanceModule } from './advance/advance.module';
import { ReceivableModule } from './receivable/receivable.module';
import { RecurringModule } from './recurring/recurring.module';
import { SegmentModule } from './segment/segment.module';
import { TypeModule } from './type/type.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService],
  imports: [
    WalletModule,
    BankModule,
    PaymentMethodModule,
    CategoryModule,
    SegmentModule,
    TypeModule,
    PayeeModule,
    RecurringModule,
    ReceivableModule,
    AdvanceModule,
  ],
  exports: [FinanceService],
})
export class FinanceModule {}
