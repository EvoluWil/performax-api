import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateAttendanceLocations } from './dto/update-attendance-location.dto';

@Injectable()
export class EmployeeAttendanceLocationService {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    employeeId: string,
    { attendanceLocations }: UpdateAttendanceLocations,
  ) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        attendanceLocations: {
          set: attendanceLocations,
        },
      },
    });
  }

  async delete(employeeId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        attendanceLocations: {
          set: [],
        },
      },
    });
  }
}
