import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CreateEmployeeVacationDto } from './dto/create-employee-vacation.dto';
import { UpdateEmployeeVacationStatusDto } from './dto/update-employee-vacation-status.dto';
import { UpdateEmployeeVacationDto } from './dto/update-employee-vacation.dto';
import { EmployeeVacationService } from './employee-vacation.service';

@Controller('companies/:companyId/employee-vacations')
export class EmployeeVacationController {
  constructor(
    private readonly employeeVacationService: EmployeeVacationService,
  ) {}

  @Post()
  create(
    @Body()
    createEmployeeVacationDto: CreateEmployeeVacationDto,
  ) {
    return this.employeeVacationService.create(createEmployeeVacationDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeVacationDto: UpdateEmployeeVacationDto,
  ) {
    return this.employeeVacationService.update(id, updateEmployeeVacationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeVacationService.remove(id);
  }

  @Put(':id/status')
  approve(
    @Param('id') id: string,
    @Body() updateEmployeeVacationStatusDto: UpdateEmployeeVacationStatusDto,
  ) {
    return this.employeeVacationService.status(
      id,
      updateEmployeeVacationStatusDto,
    );
  }
}
