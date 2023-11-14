import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateEmployeeAccessLevelDto } from './dto/update-employee-access-level.dto';

@Injectable()
export class EmployeeAccessLevelService {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    employeeId: string,
    { accessLevel }: UpdateEmployeeAccessLevelDto,
  ) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    await this.prisma.employee.update({
      where: { id: employeeId },
      data: { accessLevel },
    });
  }
}
