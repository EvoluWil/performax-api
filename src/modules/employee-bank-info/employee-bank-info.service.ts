import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateEmployeeBankInfoDto } from './dto/create-employee-bank-info.dto';
import { UpdateEmployeeBankInfoDto } from './dto/update-employee-bank-info.dto';

@Injectable()
export class EmployeeBankInfoService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEmployeeBankInfoDto: CreateEmployeeBankInfoDto) {
    const { employeeId, ...employeeBankInfoDto } = createEmployeeBankInfoDto;

    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    return this.prisma.employeeBankInfo.create({
      data: {
        ...employeeBankInfoDto,
        employee: {
          connect: {
            id: employeeId,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateEmployeeBankInfoDto: UpdateEmployeeBankInfoDto,
  ) {
    const employeeBankInfo = await this.prisma.employeeBankInfo.findFirst({
      where: { id },
    });

    if (!employeeBankInfo) {
      throw new BadRequestException('Informação bancária não encontrada');
    }

    return this.prisma.employeeBankInfo.update({
      where: { id },
      data: updateEmployeeBankInfoDto,
    });
  }
}
