import { Module } from '@nestjs/common';
import { PayeeService } from './payee.service';
import { PayeeController } from './payee.controller';

@Module({
  controllers: [PayeeController],
  providers: [PayeeService],
})
export class PayeeModule {}
