import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CreateEmployeeBankInfoDto } from './dto/create-employee-bank-info.dto';
import { UpdateEmployeeBankInfoDto } from './dto/update-employee-bank-info.dto';
import { EmployeeBankInfoService } from './employee-bank-info.service';

@Controller('companies/:companyId/employee-bank-infos')
export class EmployeeBankInfoController {
  constructor(
    private readonly employeeBankInfoService: EmployeeBankInfoService,
  ) {}

  @Post()
  create(@Body() createEmployeeBankInfoDto: CreateEmployeeBankInfoDto) {
    return this.employeeBankInfoService.create(createEmployeeBankInfoDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeBankInfoDto: UpdateEmployeeBankInfoDto,
  ) {
    return this.employeeBankInfoService.update(id, updateEmployeeBankInfoDto);
  }
}
