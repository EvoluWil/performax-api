import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';

@Injectable()
export class SegmentService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSegmentDto: CreateSegmentDto, companyId: string) {
    return this.prisma.companyFinanceSegment.create({
      data: {
        ...createSegmentDto,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.companyFinanceSegment.findMany({
      where: {
        companyId: companyId,
        deleted: false,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(segmentId: string, companyId: string) {
    const segment = await this.prisma.companyFinanceSegment.findFirst({
      where: {
        id: segmentId,
        companyId: companyId,
        deleted: false,
      },
    });

    if (!segment) {
      throw new NotFoundException('Segmento não encontrado');
    }

    return segment;
  }

  async update(
    segmentId: string,
    companyId: string,
    updateSegmentDto: UpdateSegmentDto,
  ) {
    await this.findOne(segmentId, companyId);

    return this.prisma.companyFinanceSegment.update({
      where: {
        id: segmentId,
      },
      data: updateSegmentDto,
    });
  }

  async remove(segmentId: string, companyId: string) {
    await this.findOne(segmentId, companyId);

    return this.prisma.companyFinanceSegment.update({
      where: {
        id: segmentId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
