import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    const { cpf } = createEmployeeDto;

    const employeeExists = await this.prisma.employee.findFirst({
      where: { cpf },
    });

    if (employeeExists) {
      throw new NotFoundException('Funcionário já cadastrado');
    }

    const password = await bcrypt.hash(cpf, 10);

    const employee = await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        password,
      },
    });

    return employee;
  }

  async findAll() {
    const query = await this.qb.query('employee');
    const employees = await this.prisma.employee.findMany(query);
    return employees;
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    delete employee.password;
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    if (updateEmployeeDto.cpf) {
      const cpfExists = await this.prisma.employee.findFirst({
        where: { cpf: updateEmployeeDto.cpf },
      });

      if (cpfExists && cpfExists.id !== id) {
        throw new NotFoundException('CPF já cadastrado');
      }
    }

    await this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });

    return { ok: true };
  }

  async remove(id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    await this.prisma.employee.delete({
      where: { id },
    });
  }
}
