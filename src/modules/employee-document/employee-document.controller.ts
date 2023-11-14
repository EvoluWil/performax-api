import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CreateEmployeeDocumentDto } from './dto/create-employee-document.dto';
import { UpdateEmployeeDocumentDto } from './dto/update-employee-document.dto';
import { EmployeeDocumentService } from './employee-document.service';

@Controller('companies/:companyId/employee-documents')
export class EmployeeDocumentController {
  constructor(
    private readonly employeeDocumentService: EmployeeDocumentService,
  ) {}

  @Post()
  create(@Body() createEmployeeDocumentDto: CreateEmployeeDocumentDto) {
    return this.employeeDocumentService.create(createEmployeeDocumentDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDocumentDto: UpdateEmployeeDocumentDto,
  ) {
    return this.employeeDocumentService.update(id, updateEmployeeDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeDocumentService.remove(id);
  }
}
