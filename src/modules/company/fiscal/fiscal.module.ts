import { Module } from '@nestjs/common';
import { SpedyModule } from 'src/providers/spedy/spedy.module';
import { FiscalController } from './fiscal.controller';
import { FiscalService } from './fiscal.service';
import { FiscalSpedySyncService } from './fiscal-spedy-sync.service';

@Module({
  imports: [SpedyModule],
  controllers: [FiscalController],
  providers: [FiscalService, FiscalSpedySyncService],
  exports: [FiscalService],
})
export class FiscalModule {}
