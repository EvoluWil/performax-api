import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}
  async create(createPartnerDto: CreatePartnerDto, companyId: string) {
    const partner = await this.prisma.partner.create({
      data: {
        ...createPartnerDto,
        company: { connect: { id: companyId } },
      },
    });

    return partner;
  }

  async findAll(companyId: string) {
    const query = await this.qb.query('partner');
    const partners = await this.prisma.partner.findMany({
      ...query,
      where: { ...query.where, companyId },
    });
    return partners;
  }

  async findOne(id: string) {
    const query = await this.qb.query('partner');
    const partner = await this.prisma.partner.findFirst({
      ...query,
      where: { id },
    });

    if (!partner) {
      throw new BadRequestException('Parceiro não encontrado');
    }

    return partner;
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    const partner = await this.prisma.partner.findFirst({
      where: { id },
    });

    if (!partner) {
      throw new BadRequestException('Parceiro não encontrado');
    }

    return this.prisma.partner.update({
      where: { id },
      data: updatePartnerDto,
    });
  }

  async remove(id: string) {
    const partner = await this.prisma.partner.findFirst({
      where: { id },
    });

    if (!partner) {
      throw new BadRequestException('Parceiro não encontrado');
    }

    return this.prisma.partner.delete({
      where: { id },
    });
  }
}
