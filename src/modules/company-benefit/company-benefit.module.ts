import { Module } from '@nestjs/common';
import { CompanyBenefitController } from './company-benefit.controller';
import { CompanyBenefitService } from './company-benefit.service';

@Module({
  controllers: [CompanyBenefitController],
  providers: [CompanyBenefitService],
})
export class CompanyBenefitModule {}
