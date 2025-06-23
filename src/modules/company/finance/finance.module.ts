import { Module } from '@nestjs/common';
import { BankModule } from './bank/bank.module';
import { CategoryModule } from './category/category.module';
import { PayeeModule } from './payee/payee.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { TypeModule } from './type/type.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    WalletModule,
    BankModule,
    PaymentMethodModule,
    CategoryModule,
    TypeModule,
    PayeeModule,
  ],
})
export class FinanceModule {}
