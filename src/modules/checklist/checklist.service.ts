import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createChecklistDto: CreateChecklistDto) {
    const { userId, ...rest } = createChecklistDto;
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado!');
    }

    return this.prisma.checklist.create({
      data: {
        ...rest,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll() {
    const query = await this.qb.query('checklist');
    return this.prisma.checklist.findMany({
      ...query,
    });
  }

  async findOne(checklistId: string) {
    const checklist = await this.prisma.checklist.findFirst({
      where: { id: checklistId },
      include: { user: true },
    });

    if (!checklist) {
      throw new BadRequestException('Checklist não encontrado!');
    }

    return checklist;
  }

  async update(checklistId: string, updateChecklistDto: UpdateChecklistDto) {
    const { userId, ...rest } = updateChecklistDto;
    const checklist = await this.prisma.checklist.findFirst({
      where: { id: checklistId },
    });

    if (!checklist) {
      throw new BadRequestException('Checklist não encontrado!');
    }

    if (userId) {
      return this.prisma.checklist.update({
        where: { id: checklistId },
        data: {
          ...rest,
          user: {
            connect: { id: userId },
          },
        },
      });
    }
    return this.prisma.checklist.update({
      where: { id: checklistId },
      data: rest,
    });
  }

  async remove(checklistId: string) {
    const checklist = await this.prisma.checklist.findFirst({
      where: { id: checklistId },
    });

    if (!checklist) {
      throw new BadRequestException('Checklist não encontrado!');
    }

    return this.prisma.checklist.delete({
      where: { id: checklistId },
    });
  }
}
