import { Injectable, NotFoundException } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateEmployeeDayDto } from './dto/create-employee-day.dto';
import { UpdateEmployeeDayDto } from './dto/update-employee-day.dto';

@Injectable()
export class EmployeeDayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}
  async create(employeeId: string, createEmployeeDayDto: CreateEmployeeDayDto) {
    const { in: employeeDayIn, inLunch, out, outLunch } = createEmployeeDayDto;
    const employeeDay = await this.prisma.employeeDay.create({
      data: {
        date: employeeDayIn,
        employee: {
          connect: {
            id: employeeId,
          },
        },
        in: { create: { date: employeeDayIn } },
        inLunch: { create: { date: inLunch } },
        out: { create: { date: out } },
        outLunch: { create: { date: outLunch } },
      },
    });

    return employeeDay;
  }

  async findAll() {
    const query = await this.qb.query('employeeDay');
    const employeeDays = await this.prisma.employeeDay.findMany(query);
    return employeeDays;
  }

  async findOne(id: string) {
    const employeeDay = await this.prisma.employeeDay.findFirst({
      where: {
        id,
      },
      include: {
        employee: true,
        in: true,
        out: true,
        inLunch: true,
        outLunch: true,
      },
    });

    if (!employeeDay) {
      throw new NotFoundException('Dia não encontrado');
    }

    return employeeDay;
  }

  async update(id: string, updateEmployeeDayDto: UpdateEmployeeDayDto) {
    const { in: employeeDayIn, inLunch, out, outLunch } = updateEmployeeDayDto;

    const data: any = {};

    if (employeeDayIn) {
      data.in = {
        create: { date: employeeDayIn },
      };
    }

    if (inLunch) {
      data.inLunch = {
        create: { date: inLunch },
      };
    }

    if (outLunch) {
      data.outLunch = {
        create: { date: outLunch },
      };
    }

    if (out) {
      data.out = {
        create: {
          date: out,
        },
      };
    }

    const employeeDay = await this.prisma.employeeDay.update({
      where: {
        id,
      },
      data,
    });

    return employeeDay;
  }

  async remove(id: string) {
    const employeeDay = await this.prisma.employeeDay.delete({
      where: {
        id,
      },
    });

    return employeeDay;
  }
}
