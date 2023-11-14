import { Module } from '@nestjs/common';
import { EmployeeBenefitService } from './employee-benefit.service';
import { EmployeeBenefitController } from './employee-benefit.controller';

@Module({
  controllers: [EmployeeBenefitController],
  providers: [EmployeeBenefitService]
})
export class EmployeeBenefitModule {}
