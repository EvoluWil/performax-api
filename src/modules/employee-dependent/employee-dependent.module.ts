import { Module } from '@nestjs/common';
import { EmployeeDependentController } from './employee-dependent.controller';
import { EmployeeDependentService } from './employee-dependent.service';

@Module({
  controllers: [EmployeeDependentController],
  providers: [EmployeeDependentService],
})
export class EmployeeDependentModule {}
