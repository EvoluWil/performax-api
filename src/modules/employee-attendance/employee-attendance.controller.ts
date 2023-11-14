import { Body, Controller, Post } from '@nestjs/common';
import { CreateEmployeeAttendanceDto } from './dto/create-employee-attendance.dto';
import { EmployeeAttendanceService } from './employee-attendance.service';

@Controller('companies/:companyId/employee-attendances')
export class EmployeeAttendanceController {
  constructor(
    private readonly employeeAttendanceService: EmployeeAttendanceService,
  ) {}

  @Post()
  create(@Body() createEmployeeAttendanceDto: CreateEmployeeAttendanceDto) {
    return this.employeeAttendanceService.create(createEmployeeAttendanceDto);
  }
}
