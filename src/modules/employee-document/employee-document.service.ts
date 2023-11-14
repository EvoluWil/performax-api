import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateEmployeeDocumentDto } from './dto/create-employee-document.dto';
import { UpdateEmployeeDocumentDto } from './dto/update-employee-document.dto';

@Injectable()
export class EmployeeDocumentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEmployeeDocumentDto: CreateEmployeeDocumentDto) {
    const { employeeId, ...employeeDocument } = createEmployeeDocumentDto;
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    return this.prisma.employeeDocument.create({
      data: {
        ...employeeDocument,
        employee: {
          connect: {
            id: employeeId,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateEmployeeDocumentDto: UpdateEmployeeDocumentDto,
  ) {
    const employeeDocument = await this.prisma.employeeDocument.findFirst({
      where: { id },
    });

    if (!employeeDocument) {
      throw new BadRequestException('Documento não encontrado');
    }

    return this.prisma.employeeDocument.update({
      where: { id },
      data: updateEmployeeDocumentDto,
    });
  }

  async remove(id: string) {
    const employeeDocument = await this.prisma.employeeDocument.findFirst({
      where: { id },
    });

    if (!employeeDocument) {
      throw new BadRequestException('Documento não encontrado');
    }

    return this.prisma.employeeDocument.delete({
      where: { id },
    });
  }
}
