import { Module } from '@nestjs/common';
import { EmployeeDayService } from './employee-day.service';
import { EmployeeDayController } from './employee-day.controller';

@Module({
  controllers: [EmployeeDayController],
  providers: [EmployeeDayService],
})
export class EmployeeDayModule {}
