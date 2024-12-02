import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { normalizeString } from 'src/utils/normalize.util';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}
  async create({ clientId, ...rest }: CreateEmployeeDto) {
    const body: any = rest;

    const password = await bcrypt.hash(
      normalizeString(rest?.name?.split(' ')[0]),
      10,
    );

    body.password = password;

    if (clientId) {
      body.client = { connect: { id: clientId } };
    }

    const employee = await this.prisma.employee.create({
      data: body,
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
