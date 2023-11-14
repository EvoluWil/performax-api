import { Module } from '@nestjs/common';
import { EmployeeVacationController } from './employee-vacation.controller';
import { EmployeeVacationService } from './employee-vacation.service';

@Module({
  controllers: [EmployeeVacationController],
  providers: [EmployeeVacationService],
})
export class EmployeeVacationModule {}
