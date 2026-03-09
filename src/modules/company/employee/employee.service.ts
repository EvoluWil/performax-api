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

  create({ clientId, ...rest }: CreateEmployeeDto, companyId: string) {
    return this.prisma.companyEmployee.create({
      data: {
        ...rest,
        company: {
          connect: {
            id: companyId,
          },
        },
        client: clientId
          ? {
              connect: {
                id: clientId,
              },
            }
          : undefined,
      },
    });
  }

  async findAll(companyId: string) {
    const where = { companyId, deleted: false };
    const { count, query } = await this.qb.query('employee', where);
    const employees = await this.prisma.companyEmployee.findMany({
      ...query,
    });
    return { count, data: employees };
  }

  async findOne(employeeId: string, companyId: string) {
    const employee = await this.prisma.companyEmployee.findUnique({
      where: {
        id: employeeId,
        companyId,
        deleted: false,
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return employee;
  }

  async update(
    employeeId: string,
    companyId: string,
    { clientId, ...rest }: UpdateEmployeeDto,
  ) {
    await this.findOne(employeeId, companyId);

    return this.prisma.companyEmployee.update({
      where: {
        id: employeeId,
        companyId,
      },
      data: {
        ...rest,
        client: clientId
          ? {
              connect: {
                id: clientId,
              },
            }
          : undefined,
      },
    });
  }

  async remove(employeeId: string, companyId: string) {
    await this.findOne(employeeId, companyId);

    return this.prisma.companyEmployee.update({
      where: {
        id: employeeId,
        companyId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
