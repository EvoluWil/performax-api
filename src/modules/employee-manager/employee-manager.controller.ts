import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { EmployeeManagerService } from './employee-manager.service';

@Controller('companies/:companyId/employees/:employeeId/managers')
export class EmployeeManagerController {
  constructor(
    private readonly employeeManagerService: EmployeeManagerService,
  ) {}

  @Put()
  update(
    @Param('employeeId') employeeId: string,
    @Body() updateManagerDto: UpdateManagerDto,
  ) {
    return this.employeeManagerService.update(employeeId, updateManagerDto);
  }

  @Delete()
  remove(@Param('employeeId') employeeId: string) {
    return this.employeeManagerService.delete(employeeId);
  }
}
