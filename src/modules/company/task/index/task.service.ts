import { Injectable, NotFoundException } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly qb: QBService,
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}
  async create(
    createTaskDto: CreateTaskDto,
    companyId: string,
    userId: string,
  ) {
    const data = normalizeRelations(createTaskDto) as any;

    if (createTaskDto.checklist) {
      const checklistDto = createTaskDto.checklist;
      data.checklist = {
        create: {
          modules: {
            createMany: {
              data: checklistDto.modules.map((checklistModule) => ({
                name: checklistModule.name,
                items: {
                  create: checklistModule.items.map((item) => ({
                    question: item.question,
                    expectedType: item.expectedType,
                  })),
                },
              })),
            },
          },
        },
      };
    }

    data.createdBy = { connect: { id: userId } };
    data.company = { connect: { id: companyId } };
    data.protocol = await this.util.generateUniqueProtocol('companyTask');

    return this.prisma.companyTask.create({ data });
  }

  async findAll(companyId: string) {
    const { count, query } = await this.qb.query('companyTask');
    const tasks = await this.prisma.companyTask.findMany({
      ...query,
      where: { ...query.where, companyId, deleted: false },
    });
    return { count, data: tasks };
  }

  async findOne(taskId: string, companyId: string) {
    const task = await this.prisma.companyTask.findFirst({
      where: { id: taskId, companyId, deleted: false },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada!');
    }

    return task;
  }

  async update(
    taskId: string,
    companyId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    await this.findOne(taskId, companyId);

    const data = normalizeRelations(updateTaskDto);

    await this.prisma.companyTask.update({
      where: { id: taskId },
      data,
    });

    return { ok: true };
  }

  async remove(taskId: string, companyId: string) {
    await this.findOne(taskId, companyId);

    return this.prisma.companyTask.update({
      where: { id: taskId },
      data: { deleted: true },
    });
  }
}
