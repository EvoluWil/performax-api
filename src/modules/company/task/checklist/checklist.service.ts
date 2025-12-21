import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Injectable()
export class ChecklistService {
  constructor(private readonly prisma: PrismaService) {}

  async updateChecklistItem(
    itemId: string,
    updateChecklistItemDto: UpdateChecklistItemDto,
  ) {
    await this.prisma.companyTaskChecklistItem.update({
      where: { id: itemId },
      data: updateChecklistItemDto,
    });

    return { ok: true };
  }
}
