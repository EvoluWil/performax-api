import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@Controller('companies/:companyId/employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Param('companyId') companyId: string,
  ) {
    return this.employeeService.create(createEmployeeDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.employeeService.findAll(companyId);
  }

  @Get(':employeeId')
  findOne(
    @Param('employeeId') employeeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.employeeService.findOne(employeeId, companyId);
  }

  @Put(':employeeId')
  update(
    @Param('employeeId') employeeId: string,
    @Param('companyId') companyId: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(
      employeeId,
      companyId,
      updateEmployeeDto,
    );
  }

  @Delete(':employeeId')
  remove(
    @Param('employeeId') employeeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.employeeService.remove(employeeId, companyId);
  }
}
