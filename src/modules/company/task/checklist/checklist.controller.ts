import { Body, Controller, Param, Put } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Controller('companies/:companyId/checklists')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Put(':checklistId/items/:itemId')
  updateChecklistItem(
    @Param('itemId') itemId: string,
    @Body() updateChecklistItemDto: UpdateChecklistItemDto,
  ) {
    return this.checklistService.updateChecklistItem(
      itemId,
      updateChecklistItemDto,
    );
  }
}
