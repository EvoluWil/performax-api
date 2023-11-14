import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CreateEmployeeDependentDto } from './dto/create-employee-dependent.dto';
import { UpdateEmployeeDependentDto } from './dto/update-employee-dependent.dto';
import { EmployeeDependentService } from './employee-dependent.service';

@Controller('companies/:companyId/employee-dependents')
export class EmployeeDependentController {
  constructor(
    private readonly employeeDependentService: EmployeeDependentService,
  ) {}

  @Post()
  create(@Body() createEmployeeDependentDto: CreateEmployeeDependentDto) {
    return this.employeeDependentService.create(createEmployeeDependentDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDependentDto: UpdateEmployeeDependentDto,
  ) {
    return this.employeeDependentService.update(id, updateEmployeeDependentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeDependentService.remove(id);
  }
}
