import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { generateProtocol } from 'src/utils/generate-protocol';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    authUserId: string,
    increment = 1,
  ) {
    const { clientId, typeId, userId, ...rest } = createTaskDto;
    const generatedProtocol = generateProtocol() + increment;

    const task = await this.prisma.task.findFirst({
      where: { protocol: generatedProtocol },
    });

    if (task) {
      return this.create(createTaskDto, authUserId, increment + 1);
    }

    return await this.prisma.task.create({
      data: {
        ...rest,
        protocol: generatedProtocol,
        user: {
          connect: { id: userId },
        },
        client: {
          connect: { id: clientId },
        },
        type: {
          connect: { id: typeId },
        },
        createdBy: {
          connect: { id: authUserId },
        },
      },
    });
  }

  async findAll() {
    const query = await this.qb.query('task');

    await this.prisma.task.updateMany({
      where: {
        AND: [
          {
            endDate: {
              lt: new Date(),
            },
          },
          {
            status: 'OPEN',
          },
        ],
      },
      data: {
        status: 'EXPIRED',
      },
    });

    return this.prisma.task.findMany({
      ...query,
      where: { ...query.where },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id },
      include: {
        user: true,
        client: true,
        type: true,
        updatedBy: true,
        budget: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada!');
    }

    task.updatedBy = { name: task?.updatedBy?.name } as User;

    return { ...task, user: { name: task.user.name } };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, authUserId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada!');
    }

    if (
      updateTaskDto?.endDate &&
      task.status !== 'CLOSED' &&
      !updateTaskDto.status
    ) {
      const newStatus =
        new Date(updateTaskDto.endDate) < new Date() ? 'EXPIRED' : 'OPEN';
      updateTaskDto.status = newStatus;
    }

    if (updateTaskDto?.typeId) {
      (updateTaskDto as any).type = { connect: { id: updateTaskDto.typeId } };
      delete updateTaskDto.typeId;
    }

    if (updateTaskDto?.clientId) {
      (updateTaskDto as any).client = {
        connect: { id: updateTaskDto.clientId },
      };
      delete updateTaskDto.clientId;
    }

    if (updateTaskDto?.userId) {
      (updateTaskDto as any).user = { connect: { id: updateTaskDto.userId } };
      delete updateTaskDto.userId;
    }

    (updateTaskDto as any).updatedBy = { connect: { id: authUserId } };

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada!');
    }

    return await this.prisma.task.delete({
      where: { id },
    });
  }
}
