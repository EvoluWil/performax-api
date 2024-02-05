import { Injectable, NotFoundException } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateEmployeeDayDto } from './dto/update-employee-day.dto';

@Injectable()
export class EmployeeDayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

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
    const { inClockId, inLunchClockId, outClockId, outLunchClockId } =
      updateEmployeeDayDto;

    const data: any = {};

    if (inClockId) {
      data.in = {
        connect: {
          id: inClockId,
        },
      };
    }

    if (inLunchClockId) {
      data.inLunch = {
        connect: {
          id: inLunchClockId,
        },
      };
    }

    if (outClockId) {
      data.out = {
        connect: {
          id: outClockId,
        },
      };
    }

    if (outLunchClockId) {
      data.outLunch = {
        connect: {
          id: outLunchClockId,
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
