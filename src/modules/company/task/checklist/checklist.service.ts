import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyPermissionService } from 'src/providers/permission/company-permission.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: CompanyPermissionService,
  ) {}

  async updateChecklistItem(
    itemId: string,
    updateChecklistItemDto: UpdateChecklistItemDto,
    companyId: string,
    userId: string,
  ) {
    const item = await this.prisma.companyTaskChecklistItem.findUnique({
      where: { id: itemId },
      include: {
        module: {
          include: {
            checklist: {
              include: {
                task: {
                  select: {
                    id: true,
                    companyId: true,
                    responsibleId: true,
                    deleted: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const task = item?.module?.checklist?.task;
    if (!task || task.deleted || task.companyId !== companyId) {
      throw new NotFoundException('OS não encontrada');
    }

    const ctx = await this.permissionService.resolveContext(userId, companyId);
    this.permissionService.assertOperationalRecordAccess(
      ctx,
      'task',
      task.responsibleId,
    );

    await this.prisma.companyTaskChecklistItem.update({
      where: { id: itemId },
      data: updateChecklistItemDto,
    });

    return { ok: true };
  }
}
