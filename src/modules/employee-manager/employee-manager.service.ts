import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateManagerDto } from './dto/update-manager.dto';

@Injectable()
export class EmployeeManagerService {
  constructor(private readonly prisma: PrismaService) {}

  async update(employeeId: string, { managerId }: UpdateManagerDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    const manager = await this.prisma.employee.findFirst({
      where: { id: managerId },
    });

    if (!manager) {
      throw new BadRequestException('Gerente não encontrado');
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        manager: {
          connect: {
            id: managerId,
          },
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
        manager: {
          disconnect: true,
        },
      },
    });
  }
}
