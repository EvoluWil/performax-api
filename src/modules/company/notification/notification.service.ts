import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  NotificationDomainEnum,
  NotificationTypeEnum,
  Prisma,
} from '@prisma/client';
import axios from 'axios';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { isValidObjectId } from 'src/utils/is-valid-object-id.util';
import { DeletePushDeviceDto, UpsertPushDeviceDto } from './dto/push-device.dto';
import { domainOf, notificationCopy } from './notification.copy';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export type NotifyInput = {
  companyId: string;
  recipientId?: string | null;
  actorId?: string | null;
  type: NotificationTypeEnum;
  entityId: string;
  protocol?: string | null;
  recordTitle?: string | null;
  once?: boolean;
};

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async notify(input: NotifyInput) {
    const recipientId = input.recipientId;
    if (!recipientId || recipientId === input.actorId) return;

    try {
      const domain = domainOf(input.type);
      if (input.once) {
        const existing = await this.prisma.notification.findFirst({
          where: {
            entityId: input.entityId,
            type: input.type,
          },
          select: { id: true },
        });
        if (existing) return;
      }

      const copy = notificationCopy(
        input.type,
        input.protocol,
        input.recordTitle,
      );
      const notification = await this.prisma.notification.create({
        data: {
          domain,
          type: input.type,
          entityId: input.entityId,
          title: copy.title,
          body: copy.body,
          user: { connect: { id: recipientId } },
          company: { connect: { id: input.companyId } },
        },
      });

      if (domain === NotificationDomainEnum.TASK) {
        await this.sendPush(recipientId, notification);
      }
    } catch (error) {
      this.logger.error(
        `Failed to notify ${input.type} for ${input.entityId}`,
        error,
      );
    }
  }

  async list(
    companyId: string,
    userId: string,
    domain?: string,
    cursor?: string,
    limit?: string,
  ) {
    const parsedDomain = this.parseDomain(domain);
    const take = this.parseLimit(limit);
    if (cursor && !isValidObjectId(cursor)) {
      throw new BadRequestException('Cursor inválido');
    }

    const where: Prisma.NotificationWhereInput = { companyId, userId };
    if (parsedDomain) where.domain = parsedDomain;

    const rows = await this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = rows.length > take;
    const data = hasMore ? rows.slice(0, take) : rows;

    return {
      data,
      nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null,
    };
  }

  async unreadCount(companyId: string, userId: string, domain?: string) {
    const parsedDomain = this.parseDomain(domain);
    const count = await this.prisma.notification.count({
      where: {
        companyId,
        userId,
        readAt: null,
        ...(parsedDomain ? { domain: parsedDomain } : {}),
      },
    });
    return { count };
  }

  async markRead(companyId: string, userId: string, notificationId: string) {
    if (!isValidObjectId(notificationId)) {
      throw new NotFoundException('Notificação não encontrada');
    }

    const existing = await this.prisma.notification.findFirst({
      where: { id: notificationId, companyId, userId },
      select: { id: true, readAt: true },
    });
    if (!existing) {
      throw new NotFoundException('Notificação não encontrada');
    }
    if (existing.readAt) return { ok: true };

    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  async markAllRead(companyId: string, userId: string, domain?: string) {
    const parsedDomain = this.parseDomain(domain);
    await this.prisma.notification.updateMany({
      where: {
        companyId,
        userId,
        readAt: null,
        ...(parsedDomain ? { domain: parsedDomain } : {}),
      },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  async upsertDevice(userId: string, dto: UpsertPushDeviceDto) {
    await this.prisma.pushDevice.upsert({
      where: { token: dto.token },
      create: {
        token: dto.token,
        platform: dto.platform,
        user: { connect: { id: userId } },
      },
      update: {
        platform: dto.platform,
        user: { connect: { id: userId } },
      },
    });
    return { ok: true };
  }

  async removeDevice(userId: string, dto: DeletePushDeviceDto) {
    await this.prisma.pushDevice.deleteMany({
      where: { token: dto.token, userId },
    });
    return { ok: true };
  }

  private parseDomain(domain?: string) {
    if (!domain) return undefined;
    const values = Object.values(NotificationDomainEnum);
    if (!values.includes(domain as NotificationDomainEnum)) {
      throw new BadRequestException('Domínio de notificação inválido');
    }
    return domain as NotificationDomainEnum;
  }

  private parseLimit(limit?: string) {
    const parsed = Number(limit);
    if (!limit || Number.isNaN(parsed)) return DEFAULT_LIMIT;
    return Math.min(Math.max(Math.trunc(parsed), 1), MAX_LIMIT);
  }

  private async sendPush(
    userId: string,
    notification: {
      id: string;
      companyId: string;
      entityId: string;
      domain: NotificationDomainEnum;
      title: string;
      body: string;
    },
  ) {
    const devices = await this.prisma.pushDevice.findMany({
      where: { userId },
      select: { token: true },
    });
    if (!devices.length) return;

    const messages = devices.map((device) => ({
      to: device.token,
      title: notification.title,
      body: notification.body,
      sound: 'default',
      data: {
        companyId: notification.companyId,
        entityId: notification.entityId,
        notificationId: notification.id,
        domain: notification.domain,
      },
    }));

    try {
      const { data } = await axios.post(EXPO_PUSH_URL, messages, {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
      });
      const tickets = Array.isArray(data?.data) ? data.data : [];
      await Promise.all(
        tickets.map(async (ticket: { details?: { error?: string } }, index) => {
          if (ticket?.details?.error !== 'DeviceNotRegistered') return;
          const token = messages[index]?.to;
          if (!token) return;
          await this.prisma.pushDevice.deleteMany({ where: { token } });
        }),
      );
    } catch (error) {
      this.logger.error(
        `Failed to push notification ${notification.id}`,
        error,
      );
    }
  }
}
