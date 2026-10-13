import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NotificationTypeEnum, TaskStatusEnum } from '@prisma/client';
import { NotificationService } from 'src/modules/company/notification/notification.service';
import { CompanyPermissionService } from 'src/providers/permission/company-permission.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { RecurringService } from '../recurring/recurring.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export type TaskMine = 'assigned' | 'created';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly qb: QBService,
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
    private readonly recurringService: RecurringService,
    private readonly permissionService: CompanyPermissionService,
    private readonly notifications: NotificationService,
  ) {}
  async create(
    createTaskDto: CreateTaskDto,
    companyId: string,
    userId: string,
  ) {
    const taskType = createTaskDto.typeId
      ? await this.prisma.companyTaskType.findUnique({
          where: { id: createTaskDto.typeId },
        })
      : null;

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
    data.status = TaskStatusEnum.PENDING;
    data.approved = taskType?.needApprove ? false : true;

    const task = await this.prisma.companyTask.create({ data });
    await this.notifications.notify({
      companyId,
      recipientId: createTaskDto.responsibleId,
      actorId: userId,
      type: NotificationTypeEnum.TASK_CREATED,
      entityId: task.id,
      protocol: task.protocol,
      recordTitle: task.title,
    });
    return task;
  }

  async findAll(companyId: string, userId: string, mine?: TaskMine) {
    try {
      await this.recurringService.generateForNextDays(companyId, 30);
    } catch (err) {
      this.logger.error(
        `Failed to lazy-generate task recurrences for company ${companyId}`,
        err,
      );
    }

    const ctx = await this.permissionService.resolveContext(userId, companyId);
    this.permissionService.assertPageAccess(ctx, 'task');

    const where: Record<string, unknown> = { companyId, deleted: false };
    const { count: scopedCount, query } = await this.qb.query(
      'companyTask',
      where,
    );
    const listWhere = query.where as Record<string, unknown>;
    await this.permissionService.validateOperationalListWhere(
      ctx,
      'task',
      listWhere,
    );
    this.applyMineFilter(listWhere, userId, mine);

    let count = scopedCount;
    if (mine) {
      count = await this.prisma.companyTask.count({ where: listWhere as any });
    }

    const { select, include, ...restQuery } = query;

    let tasks;
    if (include != null) {
      tasks = await this.prisma.companyTask.findMany({
        ...restQuery,
        include: {
          ...include,
          checklist: {
            include: {
              modules: {
                include: { items: true },
              },
            },
          },
        },
      });
    } else {
      tasks = await this.prisma.companyTask.findMany({
        ...restQuery,
        select: {
          ...select,
          checklist: {
            include: {
              modules: {
                include: { items: true },
              },
            },
          },
        },
      });
    }

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
      throw new NotFoundException('OS não encontrada!');
    }

    return task;
  }

  async update(
    taskId: string,
    companyId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ) {
    const original = await this.findOne(taskId, companyId);
    const ctx = await this.permissionService.resolveContext(userId, companyId);
    this.permissionService.assertOperationalRecordAccess(
      ctx,
      'task',
      original.responsibleId,
    );

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

    await this.notifyTaskChanges(original, updateTaskDto, userId, companyId);

    return { ok: true };
  }

  private async notifyTaskChanges(
    original: {
      id: string;
      protocol: string;
      title: string;
      responsibleId: string | null;
      status: TaskStatusEnum;
    },
    dto: UpdateTaskDto,
    actorId: string,
    companyId: string,
  ) {
    const recipientId = dto.responsibleId ?? original.responsibleId;
    const recordTitle = dto.title ?? original.title;

    if (dto.responsibleId && dto.responsibleId !== original.responsibleId) {
      await this.notifications.notify({
        companyId,
        recipientId: dto.responsibleId,
        actorId,
        type: NotificationTypeEnum.TASK_ASSIGNED,
        entityId: original.id,
        protocol: original.protocol,
        recordTitle,
      });
    }

    if (!dto.status || dto.status === original.status) return;

    const type =
      dto.status === TaskStatusEnum.EMERGENCY
        ? NotificationTypeEnum.TASK_EMERGENCY
        : dto.status === TaskStatusEnum.IMPEDED
          ? NotificationTypeEnum.TASK_IMPEDED
          : null;
    if (!type) return;

    await this.notifications.notify({
      companyId,
      recipientId,
      actorId,
      type,
      entityId: original.id,
      protocol: original.protocol,
      recordTitle,
    });
  }

  private applyMineFilter(
    where: Record<string, unknown>,
    userId: string,
    mine?: TaskMine,
  ) {
    if (mine === 'assigned') {
      where.responsibleId = userId;
      return;
    }

    if (mine === 'created') {
      delete where.responsibleId;
      where.createdById = userId;
    }
  }

  async approve(
    taskId: string,
    companyId: string,
    approved: boolean,
    actorId: string,
  ) {
    const task = await this.findOne(taskId, companyId);

    const updated = await this.prisma.companyTask.update({
      where: { id: taskId },
      data: approved
        ? { approved: true }
        : { approved: true, status: TaskStatusEnum.REJECTED },
    });

    await this.notifications.notify({
      companyId,
      recipientId: task.responsibleId,
      actorId,
      type: approved
        ? NotificationTypeEnum.TASK_APPROVED
        : NotificationTypeEnum.TASK_REJECTED,
      entityId: task.id,
      protocol: task.protocol,
      recordTitle: task.title,
    });

    return updated;
  }

  async remove(taskId: string, companyId: string) {
    await this.findOne(taskId, companyId);

    return this.prisma.companyTask.update({
      where: { id: taskId },
      data: { deleted: true },
    });
  }
}
