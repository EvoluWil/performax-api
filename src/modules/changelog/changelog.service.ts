import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateChangelogDto } from './dto/create-changelog.dto';
import { UpdateChangelogDto } from './dto/update-changelog.dto';

@Injectable()
export class ChangelogService {
  constructor(private readonly prisma: PrismaService) {}

  create(createChangelogDto: CreateChangelogDto) {
    return this.prisma.changelog.create({
      data: {
        ...createChangelogDto,
        date: new Date(createChangelogDto.date),
      },
    });
  }

  findAll() {
    return this.prisma.changelog.findMany({
      where: { deleted: false },
      orderBy: { date: 'desc' },
      take: 5,
    });
  }

  async findOne(id: string) {
    const changelog = await this.prisma.changelog.findUnique({
      where: { id, deleted: false },
    });

    if (!changelog) {
      throw new NotFoundException('Changelog não encontrado');
    }

    return changelog;
  }

  async update(id: string, updateChangelogDto: UpdateChangelogDto) {
    await this.findOne(id);

    return this.prisma.changelog.update({
      where: { id },
      data: {
        ...updateChangelogDto,
        date: updateChangelogDto.date
          ? new Date(updateChangelogDto.date)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.changelog.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
