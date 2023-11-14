import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCompanyBenefitDto } from './dto/create-company-benefit.dto';
import { UpdateCompanyBenefitDto } from './dto/update-company-benefit.dto';

@Injectable()
export class CompanyBenefitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    companyId: string,
    createCompanyBenefitDto: CreateCompanyBenefitDto,
  ) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return this.prisma.benefit.create({
      data: {
        ...createCompanyBenefitDto,
        company: { connect: { id: companyId } },
      },
    });
  }

  async update(id: string, updateCompanyBenefitDto: UpdateCompanyBenefitDto) {
    const companyBenefit = await this.prisma.benefit.findFirst({
      where: { id },
    });

    if (!companyBenefit) {
      throw new BadRequestException('Benefício não encontrado');
    }

    return this.prisma.benefit.update({
      where: { id },
      data: updateCompanyBenefitDto,
    });
  }

  async remove(id: string) {
    const companyBenefit = await this.prisma.benefit.findFirst({
      where: { id },
    });

    if (!companyBenefit) {
      throw new BadRequestException('Benefício não encontrado');
    }

    return this.prisma.benefit.delete({ where: { id } });
  }
}
