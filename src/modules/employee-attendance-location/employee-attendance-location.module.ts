import { Module } from '@nestjs/common';
import { EmployeeAttendanceLocationController } from './employee-attendance-location.controller';
import { EmployeeAttendanceLocationService } from './employee-attendance-location.service';

@Module({
  controllers: [EmployeeAttendanceLocationController],
  providers: [EmployeeAttendanceLocationService],
})
export class EmployeeAttendanceLocationModule {}
