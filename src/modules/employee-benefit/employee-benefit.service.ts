import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateEmployeeBenefitDto } from './dto/update-employee-benefit.dto';

@Injectable()
export class EmployeeBenefitService {
  constructor(private readonly prisma: PrismaService) {}
  async update(employeeId: string, { benefitId }: UpdateEmployeeBenefitDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
      select: { benefitsId: true },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    const benefit = await this.prisma.benefit.findFirst({
      where: { id: benefitId },
    });

    if (!benefit) {
      throw new BadRequestException('Benefício não encontrado');
    }

    if (employee.benefitsId.includes(benefitId)) {
      throw new BadRequestException('Benefício já adicionado');
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        benefits: {
          connect: { id: benefitId },
        },
      },
    });
  }

  async remove(employeeId: string, benefitId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId },
      select: { benefitsId: true },
    });

    if (!employee) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    if (!employee.benefitsId.includes(benefitId)) {
      throw new BadRequestException('Benefício não encontrado');
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        benefits: {
          disconnect: { id: benefitId },
        },
      },
    });
  }
}
