import { Injectable, NotFoundException } from '@nestjs/common';
import { differenceInMinutes, subDays } from 'date-fns';
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
    const { date } = createEmployeeClockDto;

    const employeeClock = await this.prisma.employeeClock.create({
      data: {
        date,
      },
    });

    const day = await this.prisma.employeeDay.findFirst({
      where: {
        AND: [
          { employeeId },
          {
            date: {
              lt: new Date(date),
              gte: subDays(new Date(date), 17),
            },
          },
        ],
      },
    });

    if (differenceInMinutes(new Date(date), new Date(day.updatedAt)) < 10) {
      throw new NotFoundException(
        'Não é possível registrar ponto antes de 10 minutos do último registro',
      );
    }

    if (day) {
      let type: 'out' | 'inLunch' | 'outLunch' | null = null;

      if (!day.outClockId) {
        type = 'out';
      }

      if (!day.outLunchClockId) {
        type = 'outLunch';
      }

      if (!day.inLunchClockId) {
        type = 'inLunch';
      }

      if (!type) {
        throw new NotFoundException(
          'Já foram registrados todos os pontos do dia',
        );
      }

      return this.prisma.employeeDay.update({
        where: {
          id: day.id,
        },
        data: {
          [type]: {
            connect: {
              id: employeeClock.id,
            },
          },
        },
      });
    }

    return this.prisma.employeeDay.create({
      data: {
        date: new Date(date),
        employee: {
          connect: {
            id: employeeId,
          },
        },
        in: {
          connect: {
            id: employeeClock.id,
          },
        },
      },
    });
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
}
