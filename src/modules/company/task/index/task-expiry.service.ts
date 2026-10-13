import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationTypeEnum, TaskStatusEnum } from '@prisma/client';
import { NotificationService } from 'src/modules/company/notification/notification.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';

const ACTIVE_STATUSES: TaskStatusEnum[] = [
  TaskStatusEnum.PENDING,
  TaskStatusEnum.APPROVED,
  TaskStatusEnum.OPEN,
  TaskStatusEnum.EMERGENCY,
  TaskStatusEnum.SCHEDULED,
  TaskStatusEnum.IMPEDED,
  TaskStatusEnum.IN_PROGRESS,
];

@Injectable()
export class TaskExpiryService implements OnModuleInit {
  private readonly logger = new Logger(TaskExpiryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
  ) {}

  async onModuleInit() {
    await this.expireOverdueTasks();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async expireOverdueTasks() {
    const now = new Date();

    const overdue = await this.prisma.companyTask.findMany({
      where: {
        deleted: false,
        status: { in: ACTIVE_STATUSES },
        date: { lt: now },
      },
      select: {
        id: true,
        companyId: true,
        responsibleId: true,
        protocol: true,
        title: true,
      },
    });

    if (!overdue.length) return;

    for (const task of overdue) {
      await this.notifications.notify({
        companyId: task.companyId,
        recipientId: task.responsibleId,
        type: NotificationTypeEnum.TASK_EXPIRED,
        entityId: task.id,
        protocol: task.protocol,
        recordTitle: task.title,
        once: true,
      });
    }

    const result = await this.prisma.companyTask.updateMany({
      where: {
        id: { in: overdue.map((task) => task.id) },
        deleted: false,
        status: { in: ACTIVE_STATUSES },
      },
      data: { status: TaskStatusEnum.EXPIRED },
    });

    if (result.count > 0) {
      this.logger.log(`Marked ${result.count} overdue task(s) as EXPIRED`);
    }
  }
}
