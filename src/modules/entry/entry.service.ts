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

  async create(
    createEntryDto: CreateEntryDto,
    userId: string,
    companyId: string,
  ) {
    const { typeId, responsibleId } = createEntryDto;

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

    const data = Object.entries(createEntryDto).reduce((acc, [key, value]) => {
      if (!value) {
        return acc;
      }

      if (key?.includes('Id')) {
        const newKey = key.replace('Id', '');
        return { ...acc, [newKey]: { connect: { id: value } } };
      }

      return { ...acc, [key]: value };
    }, {}) as any;

    return this.prisma.entry.create({
      data: {
        ...data,
        responsible: responsibleId
          ? { connect: { id: responsibleId } }
          : {
              connect: { id: userId },
            },
        protocol: generateProtocol(),
        approved: type?.needApprove ? false : true,
        createdBy: { connect: { id: userId } },
        company: { connect: { id: companyId } },
      },
    });
  }

  async findAll(companyId: string) {
    const query = await this.qb.query('entry');
    return this.prisma.entry.findMany({
      ...query,
      where: { companyId },
    });
  }

  async findOne(id: string) {
    const entry = await this.prisma.entry.findFirst({
      where: { id },
      include: {
        client: true,
        type: true,
        createdBy: { select: { name: true } },
        responsible: { select: { name: true } },
        employee: { select: { name: true } },
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

    if (updateEntry.employeeId) {
      updateEntry.employee = { connect: { id: updateEntryDto.employeeId } };
      delete updateEntry.employeeId;
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
