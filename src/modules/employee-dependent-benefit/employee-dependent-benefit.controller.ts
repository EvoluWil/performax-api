import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { UpdateEmployeeDependentBenefitDto } from './dto/update-dependent-employee-benefit.dto';
import { EmployeeDependentBenefitService } from './employee-dependent-benefit.service';

@Controller('companies/:companyId/dependents/:dependentId/benefits')
export class EmployeeDependentBenefitController {
  constructor(
    private readonly employeeDependentBenefitService: EmployeeDependentBenefitService,
  ) {}

  @Put()
  update(
    @Param('dependentId') dependentId: string,
    @Body()
    updateEmployeeDependentBenefitDto: UpdateEmployeeDependentBenefitDto,
  ) {
    return this.employeeDependentBenefitService.update(
      dependentId,
      updateEmployeeDependentBenefitDto,
    );
  }

  @Delete(':benefitId')
  remove(
    @Param('dependentId') dependentId: string,
    @Param('benefitId') benefitId: string,
  ) {
    return this.employeeDependentBenefitService.remove(dependentId, benefitId);
  }
}
