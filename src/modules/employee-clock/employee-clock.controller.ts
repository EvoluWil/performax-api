import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEmployeeClockDto } from './dto/create-employee-clock.dto';
import { UpdateEmployeeClockDto } from './dto/update-employee-clock.dto';
import { EmployeeClockService } from './employee-clock.service';

@Controller('employees/:employeeId/clocks')
export class EmployeeClockController {
  constructor(private readonly employeeClockService: EmployeeClockService) {}

  @Post()
  create(
    @Body() createEmployeeClockDto: CreateEmployeeClockDto,
    @Param('employeeId') employeeId: string,
  ) {
    return this.employeeClockService.create(employeeId, createEmployeeClockDto);
  }

  @Get()
  findAll() {
    return this.employeeClockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeClockService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeClockDto: UpdateEmployeeClockDto,
  ) {
    return this.employeeClockService.update(id, updateEmployeeClockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeClockService.remove(id);
  }
}
