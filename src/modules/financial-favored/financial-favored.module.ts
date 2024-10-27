import { Module } from '@nestjs/common';
import { FinancialFavoredController } from './financial-favored.controller';
import { FinancialFavoredService } from './financial-favored.service';

@Module({
  controllers: [FinancialFavoredController],
  providers: [FinancialFavoredService],
})
export class FinancialFavoredModule {}
