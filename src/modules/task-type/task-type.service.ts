import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateTaskTypeDto } from './dto/create-task-type.dto';
import { UpdateTaskTypeDto } from './dto/update-task-type.dto';

@Injectable()
export class TaskTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(createTaskTypeDto: CreateTaskTypeDto) {
    const taskType = await this.prisma.taskType.findFirst({
      where: { name: createTaskTypeDto.name },
    });

    if (taskType) {
      throw new BadRequestException('Tipo de tarefa já cadastrado!');
    }

    return this.prisma.taskType.create({
      data: createTaskTypeDto,
    });
  }

  async findAll() {
    const query = await this.qb.query('taskType');

    return this.prisma.taskType.findMany(query);
  }

  async findOne(id: string) {
    const taskType = await this.prisma.taskType.findFirst({
      where: { id },
    });

    if (!taskType) {
      throw new BadRequestException('Tipo de tarefa não encontrado!');
    }

    return taskType;
  }

  async update(id: string, updateTaskTypeDto: UpdateTaskTypeDto) {
    const taskType = await this.prisma.taskType.findFirst({
      where: { id },
    });

    if (!taskType) {
      throw new BadRequestException('Tipo de tarefa não encontrado!');
    }

    return this.prisma.taskType.update({
      where: { id },
      data: updateTaskTypeDto,
    });
  }

  async remove(id: string) {
    const taskType = await this.prisma.taskType.findFirst({
      where: { id },
    });

    if (!taskType) {
      throw new BadRequestException('Tipo de tarefa não encontrado!');
    }

    return this.prisma.taskType.delete({
      where: { id },
    });
  }
}
