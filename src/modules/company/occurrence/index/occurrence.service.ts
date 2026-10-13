import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationTypeEnum, OccurrenceStatusEnum } from '@prisma/client';
import { NotificationService } from 'src/modules/company/notification/notification.service';
import { CompanyPermissionService } from 'src/providers/permission/company-permission.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';

@Injectable()
export class OccurrenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
    private readonly qb: QBService,
    private readonly permissionService: CompanyPermissionService,
    private readonly notifications: NotificationService,
  ) {}
  async create(
    createOccurrenceDto: CreateOccurrenceDto,
    companyId: string,
    userId: string,
  ) {
    const occurrenceType = await this.prisma.companyOccurrenceType.findUnique({
      where: { id: createOccurrenceDto.typeId },
    });

    const data = normalizeRelations(createOccurrenceDto) as any;
    const protocol = await this.util.generateUniqueProtocol(
      'companyOccurrence',
    );

    const occurrence = await this.prisma.companyOccurrence.create({
      data: {
        ...data,
        status: OccurrenceStatusEnum.PENDING,
        approved: occurrenceType?.needApprove ? false : true,
        protocol,
        company: { connect: { id: companyId } },
        createdBy: { connect: { id: userId } },
      },
    });

    await this.notifications.notify({
      companyId,
      recipientId: occurrence.responsibleId,
      actorId: userId,
      type: NotificationTypeEnum.OCCURRENCE_CREATED,
      entityId: occurrence.id,
      protocol: occurrence.protocol,
      recordTitle: occurrence.title,
    });

    return occurrence;
  }

  async findAll(companyId: string, userId: string) {
    const ctx = await this.permissionService.resolveContext(userId, companyId);
    this.permissionService.assertPageAccess(ctx, 'occurrence');

    const where: Record<string, unknown> = { companyId, deleted: false };
    const { count, query } = await this.qb.query('companyOccurrence', where);
    await this.permissionService.validateOperationalListWhere(
      ctx,
      'occurrence',
      query.where as Record<string, unknown>,
    );
    const occurrences = await this.prisma.companyOccurrence.findMany({
      ...query,
    });
    return { count, data: occurrences };
  }

  async findOne(occurrenceId: string, companyId: string) {
    const occurrence = await this.prisma.companyOccurrence.findFirst({
      where: { id: occurrenceId, companyId, deleted: false },
      include: {
        client: true,
        createdBy: { select: { id: true, name: true } },
        type: true,
        responsible: { select: { id: true, name: true } },
      },
    });

    if (!occurrence) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    return occurrence;
  }

  async update(
    occurrenceId: string,
    companyId: string,
    updateOccurrenceDto: UpdateOccurrenceDto,
    actorId: string,
  ) {
    const original = await this.findOne(occurrenceId, companyId);
    const data = normalizeRelations(updateOccurrenceDto) as any;

    if (data.status === OccurrenceStatusEnum.COMPLETED) {
      data.completedAt = new Date();
    }

    await this.prisma.companyOccurrence.update({
      where: { id: occurrenceId },
      data,
    });

    if (
      updateOccurrenceDto.responsibleId &&
      updateOccurrenceDto.responsibleId !== original.responsibleId
    ) {
      await this.notifications.notify({
        companyId,
        recipientId: updateOccurrenceDto.responsibleId,
        actorId,
        type: NotificationTypeEnum.OCCURRENCE_ASSIGNED,
        entityId: original.id,
        protocol: original.protocol,
        recordTitle: updateOccurrenceDto.title ?? original.title,
      });
    }

    return { ok: true };
  }

  async approve(
    occurrenceId: string,
    companyId: string,
    approved: boolean,
    actorId: string,
  ) {
    const occurrence = await this.findOne(occurrenceId, companyId);

    const updated = await this.prisma.companyOccurrence.update({
      where: { id: occurrenceId },
      data: approved
        ? { approved: true }
        : { approved: true, status: OccurrenceStatusEnum.REJECTED },
    });

    await this.notifications.notify({
      companyId,
      recipientId: occurrence.responsibleId,
      actorId,
      type: approved
        ? NotificationTypeEnum.OCCURRENCE_APPROVED
        : NotificationTypeEnum.OCCURRENCE_REJECTED,
      entityId: occurrence.id,
      protocol: occurrence.protocol,
      recordTitle: occurrence.title,
    });

    return updated;
  }

  async remove(occurrenceId: string, companyId: string) {
    await this.findOne(occurrenceId, companyId);

    return this.prisma.companyOccurrence.update({
      where: { id: occurrenceId },
      data: { deleted: true },
    });
  }
}
