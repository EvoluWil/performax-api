import { Module } from '@nestjs/common';
import { EmployeeDependentBenefitController } from './employee-dependent-benefit.controller';
import { EmployeeDependentBenefitService } from './employee-dependent-benefit.service';

@Module({
  controllers: [EmployeeDependentBenefitController],
  providers: [EmployeeDependentBenefitService],
})
export class EmployeeDependentBenefitModule {}
