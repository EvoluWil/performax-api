import { Module } from '@nestjs/common';
import { EmployeeAccessLevelController } from './employee-access-level.controller';
import { EmployeeAccessLevelService } from './employee-access-level.service';

@Module({
  controllers: [EmployeeAccessLevelController],
  providers: [EmployeeAccessLevelService],
})
export class EmployeeAccessLevelModule {}
