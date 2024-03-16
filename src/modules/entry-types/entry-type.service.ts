import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateEntryTypeDto } from './dto/create-entry-type.dto';
import { UpdateEntryTypeDto } from './dto/update-entry-type.dto';

@Injectable()
export class EntryTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createEntryTypeDto: CreateEntryTypeDto) {
    const entryType = await this.prisma.entryType.findFirst({
      where: { name: createEntryTypeDto.name },
    });

    if (entryType) {
      throw new BadRequestException('Tipo de lançamento já cadastrado!');
    }

    return this.prisma.entryType.create({
      data: createEntryTypeDto,
    });
  }

  async findAll() {
    const query = await this.qb.query('entryType');

    return this.prisma.entryType.findMany(query);
  }

  async findOne(id: string) {
    const entryType = await this.prisma.entryType.findFirst({
      where: { id },
    });

    if (!entryType) {
      throw new BadRequestException('Tipo de lançamento não encontrado!');
    }

    return entryType;
  }

  async update(id: string, updateEntryTypeDto: UpdateEntryTypeDto) {
    const entryType = await this.prisma.entryType.findFirst({
      where: { id },
    });

    if (!entryType) {
      throw new BadRequestException('Tipo de lançamento não encontrado!');
    }

    return this.prisma.entryType.update({
      where: { id },
      data: updateEntryTypeDto,
    });
  }

  async remove(id: string) {
    const entryType = await this.prisma.entryType.findFirst({
      where: { id },
    });

    if (!entryType) {
      throw new BadRequestException('Tipo de lançamento não encontrado!');
    }

    return this.prisma.entryType.delete({
      where: { id },
    });
  }
}
