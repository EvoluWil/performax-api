import { Module } from '@nestjs/common';
import { CompanyBenefitModule } from './company-benefit/company-benefit.module';
import { CompanyRoleModule } from './company-role/company-role.module';
import { CompanySectorModule } from './company-sector/company-sector.module';
import { CompanyModule } from './company/company.module';
import { EmployeeAccessLevelModule } from './employee-access-level/employee-access-level.module';
import { EmployeeAttendanceLocationModule } from './employee-attendance-location/employee-attendance-location.module';
import { EmployeeAttendanceModule } from './employee-attendance/employee-attendance.module';
import { EmployeeBankInfoModule } from './employee-bank-info/employee-bank-info.module';
import { EmployeeBenefitModule } from './employee-benefit/employee-benefit.module';
import { EmployeeDependentBenefitModule } from './employee-dependent-benefit/employee-dependent-benefit.module';
import { EmployeeDependentModule } from './employee-dependent/employee-dependent.module';
import { EmployeeDocumentModule } from './employee-document/employee-document.module';
import { EmployeeManagerModule } from './employee-manager/employee-manager.module';
import { EmployeeVacationModule } from './employee-vacation/employee-vacation.module';
import { EmployeeModule } from './employee/employee.module';
import { ProfileAddressModule } from './profile-address/profile-address.module';
import { ProfileContactModule } from './profile-contact/profile-contact.module';
import { ProfileEducationModule } from './profile-education/profile-education.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { PartnerModule } from './partner/partner.module';
import { FinancialModule } from './financial/financial.module';
import { FinancialCategoryModule } from './financial-category/financial-category.module';
import { FinancialContractModule } from './financial-contract/financial-contract.module';

@Module({
  imports: [
    UserModule,
    ProfileModule,
    ProfileAddressModule,
    ProfileEducationModule,
    ProfileContactModule,
    CompanyModule,
    CompanySectorModule,
    CompanyRoleModule,
    CompanyBenefitModule,
    EmployeeModule,
    EmployeeBankInfoModule,
    EmployeeDocumentModule,
    EmployeeVacationModule,
    EmployeeAttendanceModule,
    EmployeeDependentModule,
    EmployeeManagerModule,
    EmployeeAttendanceLocationModule,
    EmployeeBenefitModule,
    EmployeeDependentBenefitModule,
    EmployeeAccessLevelModule,
    PartnerModule,
    FinancialModule,
    FinancialCategoryModule,
    FinancialContractModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
