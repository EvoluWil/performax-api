import { Injectable, NotFoundException } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';

@Injectable()
export class OccurrenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
    private readonly qb: QBService,
  ) {}
  async create(
    createOccurrenceDto: CreateOccurrenceDto,
    companyId: string,
    userId: string,
  ) {
    const data = normalizeRelations(createOccurrenceDto) as any;
    const protocol = await this.util.generateUniqueProtocol(
      'companyOccurrence',
    );

    const occurrence = await this.prisma.companyOccurrence.create({
      data: {
        ...data,
        protocol,
        company: { connect: { id: companyId } },
        createdBy: { connect: { id: userId } },
      },
    });

    return occurrence;
  }

  async findAll(companyId: string) {
    const { count, query } = await this.qb.query('occurrence');
    const occurrences = await this.prisma.companyOccurrence.findMany({
      ...query,
      where: { ...query.where, companyId, deleted: false },
    });

    return { count, data: occurrences };
  }

  async findOne(occurrenceId: string, companyId: string) {
    const occurrence = await this.prisma.companyOccurrence.findFirst({
      where: { id: occurrenceId, companyId, deleted: false },
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    return occurrence;
  }

  async update(
    occurrenceId: string,
    companyId: string,
    updateOccurrenceDto: UpdateOccurrenceDto,
  ) {
    await this.findOne(occurrenceId, companyId);
    const data = normalizeRelations(updateOccurrenceDto) as any;

    await this.prisma.companyOccurrence.update({
      where: { id: occurrenceId },
      data,
    });

    return { ok: true };
  }

  async remove(occurrenceId: string, companyId: string) {
    await this.findOne(occurrenceId, companyId);

    return this.prisma.companyOccurrence.update({
      where: { id: occurrenceId },
      data: { deleted: true },
    });
  }
}
