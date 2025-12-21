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
            create: checklistDto.modules.map((checklistModule) => ({
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
      select: {
        ...query.select,
        checklist: {
          include: {
            modules: {
              include: { items: true },
            },
          },
        },
      },
    });
    return { count, data: tasks };
  }

  async findOne(taskId: string, companyId: string) {
    const task = await this.prisma.companyTask.findFirst({
      where: { id: taskId, companyId, deleted: false },
      include: {
        checklist: {
          include: {
            modules: {
              include: { items: true },
            },
          },
        },
        createdBy: { select: { id: true, name: true, email: true } },
        budget: true,
        client: true,
        closeBudget: true,
        company: true,
        responsible: { select: { id: true, name: true, email: true } },
        type: true,
        updatedBy: { select: { id: true, name: true, email: true } },
      },
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
    const original = await this.findOne(taskId, companyId);

    const data: any = normalizeRelations(updateTaskDto);

    const recurrenceValue = updateTaskDto.recurrence;
    const checklistDto = updateTaskDto.checklist;

    const isMaster = !original?.recurrenceIsGenerated;
    const now = new Date();

    if (isMaster) {
      if (
        recurrenceValue !== undefined &&
        recurrenceValue !== original?.recurrence
      ) {
        await this.prisma.companyTask.deleteMany({
          where: {
            recurrenceMasterId: taskId,
            recurrenceOriginalDate: { gte: now },
            recurrenceIsGenerated: true,
          },
        });

        data.recurrenceOriginalDate = null;
      }
    }

    if (checklistDto) {
      delete data.checklist;
    }

    await this.prisma.companyTask.update({ where: { id: taskId }, data });

    if (checklistDto) {
      const taskWithChecklist = await this.prisma.companyTask.findUnique({
        where: { id: taskId },
        include: {
          checklist: {
            include: {
              modules: {
                include: { items: true },
              },
            },
          },
        },
      });

      const ops: any[] = [];

      if (taskWithChecklist?.checklist) {
        const checklist = taskWithChecklist.checklist;

        const moduleIds = (checklist.modules || []).map((m) => m.id);

        if (moduleIds.length) {
          ops.push(
            this.prisma.companyTaskChecklistItem.deleteMany({
              where: { moduleId: { in: moduleIds } },
            }),
          );
        }

        ops.push(
          this.prisma.companyTaskChecklistModule.deleteMany({
            where: { checklistId: checklist.id },
          }),
        );

        ops.push(
          this.prisma.companyTaskChecklist.delete({
            where: { id: checklist.id },
          }),
        );
      }

      const modulesCreate = (checklistDto.modules || []).map((module) => ({
        name: module.name,
        items: {
          create: (module.items || []).map((item) => ({
            question: item.question,
            expectedType: item.expectedType,
          })),
        },
      }));

      ops.push(
        this.prisma.companyTaskChecklist.create({
          data: {
            task: { connect: { id: taskId } },
            modules: { create: modulesCreate },
          },
        }),
      );

      await this.prisma.$transaction(ops);
    }

    if (isMaster) {
      const propagable = [
        'title',
        'description',
        'internalNote',
        'typeId',
        'clientId',
        'responsibleId',
        'date',
        'status',
        'files',
        'conclusionNote',
        'impedimentNote',
      ];

      const fieldsToPropagate = Object.keys(updateTaskDto).filter((k) =>
        propagable.includes(k),
      );

      if (fieldsToPropagate.length) {
        const futureEvents = await this.prisma.companyTask.findMany({
          where: {
            recurrenceMasterId: taskId,
            recurrenceOriginalDate: { gte: now },
            recurrenceIsGenerated: true,
          },
        });

        const ops = [];

        for (const ev of futureEvents) {
          const updateData = {};

          for (const key of fieldsToPropagate) {
            if (key.endsWith('Id')) {
              const relKey = key.replace(/Id$/, '');
              const val = updateTaskDto[key];
              updateData[relKey] = val ? { connect: { id: val } } : null;
            } else {
              updateData[key] = updateTaskDto[key];
            }
          }

          ops.push(
            this.prisma.companyTask.update({
              where: { id: ev.id },
              data: updateData,
            }),
          );
        }

        if (ops.length) await Promise.all(ops);
      }
    }

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
