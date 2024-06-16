import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { generateProtocol } from 'src/utils/generate-protocol';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Injectable()
export class EntryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createEntryDto: CreateEntryDto, userId: string) {
    const { clientId, typeId, responsibleId, ...rest } = createEntryDto;

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    const client = await this.prisma.client.findFirst({
      where: { id: clientId },
    });

    if (!client) {
      throw new BadRequestException('Cliente não encontrado!');
    }

    const type = await this.prisma.entryType.findFirst({
      where: { id: typeId },
    });

    if (!type) {
      throw new BadRequestException('Tipo não encontrado!');
    }

    if (responsibleId) {
      const responsible = await this.prisma.user.findFirst({
        where: { id: responsibleId },
      });

      if (!responsible) {
        throw new BadRequestException('Responsável não encontrado!');
      }
    }

    return this.prisma.entry.create({
      data: {
        ...rest,
        protocol: generateProtocol(),
        approved: type?.needApprove ? false : true,
        createdBy: { connect: { id: userId } },
        client: { connect: { id: clientId } },
        type: { connect: { id: typeId } },
        responsible: { connect: { id: responsibleId || userId } },
      },
    });
  }

  async findAll() {
    const query = await this.qb.query('entry');
    return this.prisma.entry.findMany(query);
  }

  async findOne(id: string) {
    const entry = await this.prisma.entry.findFirst({
      where: { id },
      include: {
        client: true,
        type: true,
        createdBy: { select: { name: true } },
        responsible: { select: { name: true } },
      },
    });

    if (!entry) {
      throw new BadRequestException('Lançamento não encontrado!');
    }

    return entry;
  }

  async update(id: string, updateEntryDto: UpdateEntryDto) {
    const entry = await this.prisma.entry.findFirst({
      where: { id },
    });

    if (!entry) {
      throw new BadRequestException('Lançamento não encontrado!');
    }

    const updateEntry: any = { ...updateEntryDto };

    if (updateEntry.clientId) {
      updateEntry.client = { connect: { id: updateEntryDto.clientId } };
      delete updateEntry.clientId;
    }

    if (updateEntry.typeId) {
      updateEntry.type = { connect: { id: updateEntryDto.typeId } };
      delete updateEntry.typeId;
    }

    if (updateEntry.responsibleId) {
      updateEntry.responsible = {
        connect: { id: updateEntryDto.responsibleId },
      };
      delete updateEntry.responsibleId;
    }

    return this.prisma.entry.update({
      where: { id },
      data: updateEntry,
    });
  }

  async remove(id: string) {
    const entry = await this.prisma.entry.findFirst({
      where: { id },
    });

    if (!entry) {
      throw new BadRequestException('Lançamento não encontrado!');
    }

    return this.prisma.entry.delete({
      where: { id },
    });
  }
}
