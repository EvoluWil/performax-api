import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateOccurrenceTypeDto } from './dto/create-occurrence-type.dto';
import { UpdateOccurrenceTypeDto } from './dto/update-occurrence-type.dto';

@Injectable()
export class OccurrenceTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}
  async create(createOccurrenceTypeDto: CreateOccurrenceTypeDto) {
    await this.prisma.occurrenceType.create({
      data: createOccurrenceTypeDto,
    });

    return { ok: true };
  }

  async findAll() {
    const query = await this.qb.query('occurrenceType');

    return this.prisma.occurrenceType.findMany(query);
  }

  async findOne(id: string) {
    const types = await this.prisma.occurrenceType.findFirst({
      where: { id },
    });

    if (!types) {
      throw new BadRequestException('Tipo de ocorrência não encontrada!');
    }

    return types;
  }

  async update(id: string, updateOccurrenceTypeDto: UpdateOccurrenceTypeDto) {
    const types = await this.prisma.occurrenceType.findFirst({
      where: { id },
    });

    if (!types) {
      throw new BadRequestException('Tipo de ocorrência não encontrada!');
    }

    await this.prisma.occurrenceType.update({
      where: { id },
      data: updateOccurrenceTypeDto,
    });

    return { ok: true };
  }

  async remove(id: string) {
    const types = await this.prisma.occurrenceType.findFirst({
      where: { id },
    });

    if (!types) {
      throw new BadRequestException('Tipo de ocorrência não encontrada!');
    }

    await this.prisma.occurrenceType.delete({
      where: { id },
    });

    return { ok: true };
  }
}
