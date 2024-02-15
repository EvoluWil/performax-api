import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEmployeeDayDto } from './dto/create-employee-day.dto';
import { UpdateEmployeeDayDto } from './dto/update-employee-day.dto';
import { EmployeeDayService } from './employee-day.service';

@Controller('employees/:employeeId/days')
export class EmployeeDayController {
  constructor(private readonly employeeDayService: EmployeeDayService) {}

  @Post()
  create(
    @Param('employeeId') employeeId: string,
    @Body() createEmployeeDayDto: CreateEmployeeDayDto,
  ) {
    return this.employeeDayService.create(employeeId, createEmployeeDayDto);
  }

  @Get()
  findAll() {
    return this.employeeDayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeDayService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDayDto: UpdateEmployeeDayDto,
  ) {
    return this.employeeDayService.update(id, updateEmployeeDayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeDayService.remove(id);
  }
}
