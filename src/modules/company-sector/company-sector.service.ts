import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCompanySectorDto } from './dto/create-company-sector.dto';
import { UpdateCompanySectorDto } from './dto/update-company-sector.dto';

@Injectable()
export class CompanySectorService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    companyId: string,
    createCompanySectorDto: CreateCompanySectorDto,
  ) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return this.prisma.sector.create({
      data: {
        ...createCompanySectorDto,
        company: { connect: { id: companyId } },
      },
    });
  }

  async update(
    companyId: string,
    sectorId: string,
    updateCompanySectorDto: UpdateCompanySectorDto,
  ) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    const sector = await this.prisma.sector.findFirst({
      where: { id: sectorId },
    });

    if (!sector) {
      throw new BadRequestException('Setor não encontrado');
    }

    return this.prisma.sector.update({
      where: { id: sectorId },
      data: updateCompanySectorDto,
    });
  }

  async remove(sectorId: string) {
    const sector = await this.prisma.sector.findFirst({
      where: { id: sectorId },
    });

    if (!sector) {
      throw new BadRequestException('Setor não encontrado');
    }

    return this.prisma.sector.delete({
      where: { id: sectorId },
    });
  }
}
