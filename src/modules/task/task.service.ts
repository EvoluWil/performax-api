import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return await this.prisma.task.create({
      data: {
        ...createTaskDto,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll(userId: string) {
    const query = await this.qb.query('task');

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    const tasksTemp = await this.prisma.task.findMany({
      ...query,
      where: { ...query.where, userId },
    });

    const tasks: Task[] = [];

    const expiredTasks = tasksTemp
      .filter((task) => {
        if (
          task.status === 'OPEN' &&
          task?.endDate &&
          new Date(task.endDate) < new Date()
        ) {
          tasks.push({ ...task, status: 'EXPIRED' });
          return true;
        }
        tasks.push(task);
        return false;
      })
      .map((task) => this.update(task.id, { status: 'EXPIRED' }));

    await Promise.all(expiredTasks);

    return { tasks, user };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id },
      include: { user: true },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada!');
    }

    return { ...task, user: { name: task.user.name } };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId?: string) {
    const task = await this.prisma.task.findFirst({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada!');
    }

    if (userId) {
      if (updateTaskDto?.endDate && task.status !== 'CLOSED') {
        const newStatus =
          new Date(updateTaskDto.endDate) < new Date() ? 'EXPIRED' : 'OPEN';
        updateTaskDto.status = newStatus;
      }
      return await this.prisma.task.update({
        where: { id },
        data: {
          ...updateTaskDto,
          updatedBy: { connect: { id: userId } },
        },
      });
    } else {
      return await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
    }
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
