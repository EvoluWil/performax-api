import { Injectable, NotFoundException } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Injectable()
export class EntryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
    private readonly qb: QBService,
  ) {}

  async create(
    createEntryDto: CreateEntryDto,
    companyId: string,
    userId: string,
  ) {
    const data = normalizeRelations(createEntryDto) as any;
    const protocol = await this.util.generateUniqueProtocol('companyEntry');
    return this.prisma.companyEntry.create({
      data: {
        ...data,
        company: { connect: { id: companyId } },
        createdBy: { connect: { id: userId } },
        protocol,
      },
    });
  }

  async findAll(companyId: string) {
    const { count, query } = await this.qb.query('entry');
    const entries = await this.prisma.companyEntry.findMany({
      ...query,
      where: { ...query.where, companyId, deleted: false },
    });
    return { count, data: entries };
  }

  async findOne(entryId: string, companyId: string) {
    const entry = await this.prisma.companyEntry.findFirst({
      where: { id: entryId, companyId, deleted: false },
    });

    if (!entry) {
      throw new NotFoundException('Lançamento não encontrado');
    }

    return entry;
  }

  async update(
    entryId: string,
    companyId: string,
    updateEntryDto: UpdateEntryDto,
  ) {
    await this.findOne(entryId, companyId);
    return this.prisma.companyEntry.update({
      where: { id: entryId },
      data: updateEntryDto,
    });
  }

  async remove(entryId: string, companyId: string) {
    await this.findOne(entryId, companyId);
    return this.prisma.companyEntry.update({
      where: { id: entryId },
      data: { deleted: true },
    });
  }
}
