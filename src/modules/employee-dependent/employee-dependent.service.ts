import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateEmployeeDependentDto } from './dto/create-employee-dependent.dto';
import { UpdateEmployeeDependentDto } from './dto/update-employee-dependent.dto';

@Injectable()
export class EmployeeDependentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDependentDto: CreateEmployeeDependentDto) {
    const { employeeId, ...employeeDependent } = createEmployeeDependentDto;

    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    return this.prisma.employeeDependent.create({
      data: {
        ...employeeDependent,
        employee: { connect: { id: employeeId } },
      },
    });
  }

  async update(
    id: string,
    updateEmployeeDependentDto: UpdateEmployeeDependentDto,
  ) {
    const employeeDependent = await this.prisma.employeeDependent.findFirst({
      where: { id },
    });

    if (!employeeDependent) {
      throw new BadRequestException('Dependente não encontrado');
    }

    return this.prisma.employeeDependent.update({
      where: { id },
      data: updateEmployeeDependentDto,
    });
  }

  async remove(id: string) {
    const employeeDependent = await this.prisma.employeeDependent.findFirst({
      where: { id },
    });

    if (!employeeDependent) {
      throw new BadRequestException('Dependente não encontrado');
    }

    return this.prisma.employeeDependent.delete({ where: { id } });
  }
}
