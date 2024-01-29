import { Module } from '@nestjs/common';
import { EmployeeClockService } from './employee-clock.service';
import { EmployeeClockController } from './employee-clock.controller';

@Module({
  controllers: [EmployeeClockController],
  providers: [EmployeeClockService],
})
export class EmployeeClockModule {}
