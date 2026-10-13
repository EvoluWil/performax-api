import { Body, Controller, Param, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { ChecklistService } from './checklist.service';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Controller('companies/:companyId/checklists')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Put(':checklistId/items/:itemId')
  @RequirePermission('task', 'WRITE')
  updateChecklistItem(
    @Param('companyId') companyId: string,
    @Param('itemId') itemId: string,
    @AuthUser() user: User,
    @Body() updateChecklistItemDto: UpdateChecklistItemDto,
  ) {
    return this.checklistService.updateChecklistItem(
      itemId,
      updateChecklistItemDto,
      companyId,
      user.id,
    );
  }
}
