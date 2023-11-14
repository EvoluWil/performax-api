import { Module } from '@nestjs/common';
import { EmployeeManagerController } from './employee-manager.controller';
import { EmployeeManagerService } from './employee-manager.service';

@Module({
  controllers: [EmployeeManagerController],
  providers: [EmployeeManagerService],
})
export class EmployeeManagerModule {}
