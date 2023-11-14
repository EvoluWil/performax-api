import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { distanceValidate } from 'src/utils/distance-validate.util';
import { CreateEmployeeAttendanceDto } from './dto/create-employee-attendance.dto';

@Injectable()
export class EmployeeAttendanceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEmployeeAttendanceDto: CreateEmployeeAttendanceDto) {
    const { employeeId, ...employeeAttendance } = createEmployeeAttendanceDto;

    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    if (employee.attendanceLocations.length) {
      const location = employee.attendanceLocations.find((location) =>
        distanceValidate(location, employeeAttendance.location),
      );

      if (!location) {
        throw new BadRequestException('Muito longe do local de trabalho');
      }
    }

    return this.prisma.employeeAttendance.create({
      data: {
        ...employeeAttendance,
        employee: {
          connect: {
            id: employeeId,
          },
        },
      },
    });
  }
}
