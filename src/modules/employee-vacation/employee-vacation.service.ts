import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateEmployeeVacationDto } from './dto/create-employee-vacation.dto';
import { UpdateEmployeeVacationStatusDto } from './dto/update-employee-vacation-status.dto';
import { UpdateEmployeeVacationDto } from './dto/update-employee-vacation.dto';

@Injectable()
export class EmployeeVacationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeVacationDto: CreateEmployeeVacationDto) {
    const { employeeId, ...employeeVacation } = createEmployeeVacationDto;
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    return this.prisma.employeeVacation.create({
      data: {
        ...employeeVacation,
        employee: { connect: { id: employeeId } },
      },
    });
  }

  async update(
    id: string,
    updateEmployeeVacationDto: UpdateEmployeeVacationDto,
  ) {
    const employeeVacation = await this.prisma.employeeVacation.findFirst({
      where: { id },
    });

    if (!employeeVacation) {
      throw new BadRequestException('Solicitação de férias não encontrada');
    }

    return this.prisma.employeeVacation.update({
      where: { id },
      data: updateEmployeeVacationDto,
    });
  }

  async remove(id: string) {
    const employeeVacation = await this.prisma.employeeVacation.findFirst({
      where: { id },
    });

    if (!employeeVacation) {
      throw new BadRequestException('Solicitação de férias não encontrada');
    }

    return this.prisma.employeeVacation.update({
      where: { id },
      data: { status: 'CANCELED' },
    });
  }

  async status(
    id: string,
    updateEmployeeVacationStatusDto: UpdateEmployeeVacationStatusDto,
  ) {
    const employeeVacation = await this.prisma.employeeVacation.findFirst({
      where: { id },
    });

    if (!employeeVacation) {
      throw new BadRequestException('Solicitação de férias não encontrada');
    }

    return this.prisma.employeeVacation.update({
      where: { id },
      data: updateEmployeeVacationStatusDto,
    });
  }
}
