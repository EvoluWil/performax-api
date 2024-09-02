import { Module } from '@nestjs/common';
import { FinancialTypeController } from './financial-type.controller';
import { FinancialTypeService } from './financial-type.service';

@Module({
  controllers: [FinancialTypeController],
  providers: [FinancialTypeService],
})
export class FinancialTypeModule {}
