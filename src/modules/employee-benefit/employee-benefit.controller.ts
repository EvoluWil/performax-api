import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { UpdateEmployeeBenefitDto } from './dto/update-employee-benefit.dto';
import { EmployeeBenefitService } from './employee-benefit.service';

@Controller('companies/:companyId/employees/:employeeId/benefits')
export class EmployeeBenefitController {
  constructor(
    private readonly employeeBenefitService: EmployeeBenefitService,
  ) {}

  @Put()
  update(
    @Param('employeeId') employeeId: string,
    @Body() updateEmployeeBenefitDto: UpdateEmployeeBenefitDto,
  ) {
    return this.employeeBenefitService.update(
      employeeId,
      updateEmployeeBenefitDto,
    );
  }

  @Delete(':benefitId')
  remove(
    @Param('employeeId') employeeId: string,
    @Param('benefitId') benefitId: string,
  ) {
    return this.employeeBenefitService.remove(employeeId, benefitId);
  }
}
