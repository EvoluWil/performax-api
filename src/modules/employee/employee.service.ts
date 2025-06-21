import { Injectable, NotFoundException } from '@nestjs/common';
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
  async create({ clientId, ...rest }: CreateEmployeeDto, companyId: string) {
    const employee = await this.prisma.employee.create({
      data: {
        ...rest,
        company: { connect: { id: companyId } },
        client: clientId ? { connect: { id: clientId } } : undefined,
      },
    });

    return employee;
  }

  async findAll(companyId: string) {
    const query = await this.qb.query('employee');
    const employees = await this.prisma.employee.findMany({
      ...query,
      where: { companyId },
    });
    return employees;
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

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
