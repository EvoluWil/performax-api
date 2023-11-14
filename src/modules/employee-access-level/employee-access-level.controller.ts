import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateEmployeeAccessLevelDto } from './dto/update-employee-access-level.dto';
import { EmployeeAccessLevelService } from './employee-access-level.service';

@Controller('companies/:companyId/employees/:employeeId/access-levels')
export class EmployeeAccessLevelController {
  constructor(
    private readonly employeeAccessLevelService: EmployeeAccessLevelService,
  ) {}

  @Put()
  update(
    @Param('employeeId') employeeId: string,
    @Body() updateEmployeeAccessLevelDto: UpdateEmployeeAccessLevelDto,
  ) {
    return this.employeeAccessLevelService.update(
      employeeId,
      updateEmployeeAccessLevelDto,
    );
  }
}
