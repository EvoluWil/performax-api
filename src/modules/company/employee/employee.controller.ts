import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';

@Controller('companies/:companyId/employees')
@RequirePermission('employee', 'READ')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @RequirePermission('employee', 'WRITE')
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
  @RequirePermission('employee', 'WRITE')
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
  @RequirePermission('employee', 'ADMIN')
  remove(
    @Param('employeeId') employeeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.employeeService.remove(employeeId, companyId);
  }
}
