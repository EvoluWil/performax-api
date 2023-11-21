import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { UserService } from '../user/user.service';
import { EmailService } from 'src/providers/email/email.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, UserService, EmailService],
})
export class EmployeeModule {}
