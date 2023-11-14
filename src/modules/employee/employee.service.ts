import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(companyId: string, createEmployeeDto: CreateEmployeeDto) {
    const { roleId, userId, ...newEmployee } = createEmployeeDto;
    const company = await this.prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    const role = await this.prisma.role.findFirst({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException('Cargo não encontrado');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return this.prisma.employee.create({
      data: {
        ...newEmployee,
        role: { connect: { id: roleId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll() {
    const query = await this.qb.query('employee');
    const employees = await this.prisma.employee.findMany(query);
    return employees;
  }

  async findOne(id: string) {
    const query = await this.qb.query('employee');
    const employee = await this.prisma.employee.findFirst({
      ...query,
      where: { id },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const { roleId, ...newEmployee } = updateEmployeeDto;
    const employee = await this.prisma.employee.findFirst({
      where: { id },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    return this.prisma.employee.update({
      where: { id },
      data: roleId
        ? { ...newEmployee, role: { connect: { id: roleId } } }
        : newEmployee,
    });
  }

  async remove(id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
