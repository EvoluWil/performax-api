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
    await this.findOne(taskId, companyId);

    const data = normalizeRelations(updateTaskDto) as any;

    // If a checklist is provided in the update DTO, overwrite the existing
    // checklist by upserting: on update delete all modules and recreate from
    // the incoming payload. This ensures the checklist is fully replaced.
    const checklistDto = (updateTaskDto as any).checklist;

    // Remove checklist from the main data object so we can handle it with
    // explicit operations (delete old -> create new) to avoid relation
    // integrity errors.
    if (checklistDto) {
      delete data.checklist;
    }

    // Update the task fields first (without checklist)
    await this.prisma.companyTask.update({
      where: { id: taskId },
      data,
    });

    // If checklist present, fully replace existing checklist (if any) with
    // a freshly created one. We perform deletes in the correct order to
    // avoid violating required relations: items -> modules -> checklist,
    // then create a new checklist connected to the task.
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
          // delete items that belong to these modules
          ops.push(
            this.prisma.companyTaskChecklistItem.deleteMany({
              where: { moduleId: { in: moduleIds } },
            }),
          );
        }

        // delete modules
        ops.push(
          this.prisma.companyTaskChecklistModule.deleteMany({
            where: { checklistId: checklist.id },
          }),
        );

        // delete the checklist record itself
        ops.push(
          this.prisma.companyTaskChecklist.delete({
            where: { id: checklist.id },
          }),
        );
      }

      // After removal (or if none existed) create a fresh checklist and
      // connect it to the task
      const modulesCreate = (checklistDto.modules || []).map((module) => ({
        name: module.name,
        items: {
          create: (module.items || []).map((item) => ({
            question: item.question,
            expectedType: item.expectedType,
          })),
        },
      }));

      // create checklist connected to the task
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
