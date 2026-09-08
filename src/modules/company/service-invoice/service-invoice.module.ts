import { Module } from '@nestjs/common';
import { MailModule } from 'src/providers/mail/mail.module';
import { SpedyModule } from 'src/providers/spedy/spedy.module';
import { ServiceInvoiceController } from './service-invoice.controller';
import { ServiceInvoiceService } from './service-invoice.service';

@Module({
  imports: [SpedyModule, MailModule],
  controllers: [ServiceInvoiceController],
  providers: [ServiceInvoiceService],
})
export class ServiceInvoiceModule {}
