import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { UpdateAttendanceLocations } from './dto/update-attendance-location.dto';
import { EmployeeAttendanceLocationService } from './employee-attendance-location.service';

@Controller('companies/:companyId/employees/:employeeId/attendance-locations')
export class EmployeeAttendanceLocationController {
  constructor(
    private readonly employeeAttendanceLocationService: EmployeeAttendanceLocationService,
  ) {}

  @Put()
  updateAttendanceLocations(
    @Param('employeeId') employeeId: string,
    @Body() updateAttendanceLocations: UpdateAttendanceLocations,
  ) {
    return this.employeeAttendanceLocationService.update(
      employeeId,
      updateAttendanceLocations,
    );
  }

  @Delete()
  remove(@Param('employeeId') employeeId: string) {
    return this.employeeAttendanceLocationService.delete(employeeId);
  }
}
