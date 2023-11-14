import { Module } from '@nestjs/common';
import { EmployeeDocumentController } from './employee-document.controller';
import { EmployeeDocumentService } from './employee-document.service';

@Module({
  controllers: [EmployeeDocumentController],
  providers: [EmployeeDocumentService],
})
export class EmployeeDocumentModule {}
