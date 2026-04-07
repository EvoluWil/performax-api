import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpsertWhiteLabelDto } from './dto/upsert-white-label.dto';

@Injectable()
export class WhiteLabelService {
  constructor(private readonly prisma: PrismaService) {}

  async get(companyId: string) {
    return this.prisma.companyWhiteLabel.findUnique({
      where: { companyId },
    });
  }

  async upsert(companyId: string, dto: UpsertWhiteLabelDto) {
    const existing = await this.prisma.companyWhiteLabel.findUnique({
      where: { companyId },
    });

    if (existing) {
      return this.prisma.companyWhiteLabel.update({
        where: { companyId },
        data: dto,
      });
    }

    return this.prisma.companyWhiteLabel.create({
      data: {
        name: '',
        logo: '',
        banner: '',
        primaryColor: '#1976d2',
        secondaryColor: '#9c27b0',
        ...dto,
        company: { connect: { id: companyId } },
      },
    });
  }

  async remove(companyId: string) {
    const existing = await this.prisma.companyWhiteLabel.findUnique({
      where: { companyId },
    });

    if (!existing) {
      throw new NotFoundException('White label não encontrado');
    }

    return this.prisma.companyWhiteLabel.delete({
      where: { companyId },
    });
  }
}
