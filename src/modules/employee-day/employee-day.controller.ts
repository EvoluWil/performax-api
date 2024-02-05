import { Controller, Delete, Get, Param } from '@nestjs/common';
import { EmployeeDayService } from './employee-day.service';

@Controller('employees/:employeeId/days')
export class EmployeeDayController {
  constructor(private readonly employeeDayService: EmployeeDayService) {}

  @Get()
  findAll() {
    return this.employeeDayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeDayService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeDayService.remove(id);
  }
}
