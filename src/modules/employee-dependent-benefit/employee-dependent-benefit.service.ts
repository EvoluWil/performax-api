import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateEmployeeDependentBenefitDto } from './dto/update-dependent-employee-benefit.dto';

@Injectable()
export class EmployeeDependentBenefitService {
  constructor(private readonly prisma: PrismaService) {}
  async update(
    dependentId: string,
    { benefitId }: UpdateEmployeeDependentBenefitDto,
  ) {
    const dependent = await this.prisma.employeeDependent.findFirst({
      where: { id: dependentId },
      select: { benefitsId: true },
    });

    if (!dependent) {
      throw new BadRequestException('Dependente não encontrado');
    }

    const benefit = await this.prisma.benefit.findFirst({
      where: { id: benefitId },
    });

    if (!benefit) {
      throw new BadRequestException('Benefício não encontrado');
    }

    if (dependent.benefitsId.includes(benefitId)) {
      throw new BadRequestException('Benefício já adicionado');
    }

    return this.prisma.employeeDependent.update({
      where: { id: dependentId },
      data: {
        benefits: {
          connect: { id: benefitId },
        },
      },
    });
  }

  async remove(dependentId: string, benefitId: string) {
    const dependent = await this.prisma.employeeDependent.findFirst({
      where: { id: dependentId },
      select: { benefitsId: true },
    });

    if (!dependent) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    if (!dependent.benefitsId.includes(benefitId)) {
      throw new BadRequestException('Benefício não encontrado');
    }

    return this.prisma.employeeDependent.update({
      where: { id: dependentId },
      data: {
        benefits: {
          disconnect: { id: benefitId },
        },
      },
    });
  }
}
