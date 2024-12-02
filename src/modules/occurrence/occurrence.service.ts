import { Injectable, NotFoundException } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { generateProtocol } from 'src/utils/generate-protocol';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';

@Injectable()
export class OccurrenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createOccurrenceDto: CreateOccurrenceDto, userId: string) {
    const { clientId, typeId, ...rest } = createOccurrenceDto;

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const type = await this.prisma.occurrenceType.findUnique({
      where: { id: typeId },
    });

    if (!type) {
      throw new NotFoundException('Tipo não encontrado');
    }

    await this.prisma.occurrence.create({
      data: {
        ...rest,
        protocol: generateProtocol(),
        client: { connect: { id: clientId } },
        createdBy: { connect: { id: userId } },
        type: { connect: { id: typeId } },
      },
    });

    return { ok: true };
  }

  async findAll() {
    const query = await this.qb.query('occurrence');
    return this.prisma.occurrence.findMany(query);
  }

  async findOne(id: string) {
    const occurrence = await this.prisma.occurrence.findUnique({
      where: { id },
      include: {
        client: true,
        createdBy: true,
        type: true,
      },
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    return occurrence;
  }

  async update(id: string, updateOccurrenceDto: UpdateOccurrenceDto) {
    const data: any = { ...updateOccurrenceDto };

    const occurrence = await this.prisma.occurrence.findUnique({
      where: { id },
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    if (updateOccurrenceDto.clientId) {
      const client = await this.prisma.client.findUnique({
        where: { id: updateOccurrenceDto.clientId },
      });

      if (!client) {
        throw new NotFoundException('Cliente não encontrado');
      }
      delete data.clientId;
      data.client = { connect: { id: updateOccurrenceDto.clientId } };
    }

    await this.prisma.occurrence.update({
      where: { id },
      data,
    });

    return { ok: true };
  }

  async remove(id: string) {
    const occurrence = await this.prisma.occurrence.findUnique({
      where: { id },
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    await this.prisma.occurrence.delete({
      where: { id },
    });

    return { ok: true };
  }
}
