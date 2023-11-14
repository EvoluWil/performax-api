import { Module } from '@nestjs/common';
import { EmployeeBankInfoController } from './employee-bank-info.controller';
import { EmployeeBankInfoService } from './employee-bank-info.service';

@Module({
  controllers: [EmployeeBankInfoController],
  providers: [EmployeeBankInfoService],
})
export class EmployeeBankInfoModule {}
