import { Injectable, NotFoundException } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateEmployeeClockDto } from './dto/create-employee-clock.dto';
import { UpdateEmployeeClockDto } from './dto/update-employee-clock.dto';

@Injectable()
export class EmployeeClockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(
    employeeId: string,
    createEmployeeClockDto: CreateEmployeeClockDto,
  ) {
    const { date, type } = createEmployeeClockDto;

    const employeeClock = await this.prisma.employeeClock.create({
      data: {
        date,
        type,
        employeeId,
      },
    });

    return employeeClock;
  }

  async findAll() {
    const query = await this.qb.query('employeeClock');
    const employeeClocks = await this.prisma.employeeClock.findMany(query);
    return employeeClocks;
  }

  async findOne(id: string) {
    const employeeClock = await this.prisma.employeeClock.findFirst({
      where: { id },
    });

    if (!employeeClock) {
      throw new NotFoundException('Registro de ponto não encontrado');
    }

    return employeeClock;
  }

  async update(id: string, updateEmployeeClockDto: UpdateEmployeeClockDto) {
    const employeeClock = await this.prisma.employeeClock.findFirst({
      where: { id },
    });

    if (!employeeClock) {
      throw new NotFoundException('Registro de ponto não encontrado');
    }

    const updatedEmployeeClock = await this.prisma.employeeClock.update({
      where: { id },
      data: updateEmployeeClockDto,
    });

    return updatedEmployeeClock;
  }

  async remove(id: string) {
    const employeeClock = await this.prisma.employeeClock.findFirst({
      where: { id },
    });

    if (!employeeClock) {
      throw new NotFoundException('Registro de ponto não encontrado');
    }

    await this.prisma.employeeClock.delete({
      where: { id },
    });

    return employeeClock;
  }
}
