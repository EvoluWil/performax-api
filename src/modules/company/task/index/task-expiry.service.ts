import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskStatusEnum } from '@prisma/client';
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

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.expireOverdueTasks();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async expireOverdueTasks() {
    const now = new Date();

    const result = await this.prisma.companyTask.updateMany({
      where: {
        deleted: false,
        status: { in: ACTIVE_STATUSES },
        date: { lt: now },
      },
      data: { status: TaskStatusEnum.EXPIRED },
    });

    if (result.count > 0) {
      this.logger.log(`Marked ${result.count} overdue task(s) as EXPIRED`);
    }
  }
}
