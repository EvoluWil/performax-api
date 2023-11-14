import { Module } from '@nestjs/common';
import { FinancialCategoryService } from './financial-category.service';
import { FinancialCategoryController } from './financial-category.controller';

@Module({
  controllers: [FinancialCategoryController],
  providers: [FinancialCategoryService]
})
export class FinancialCategoryModule {}
