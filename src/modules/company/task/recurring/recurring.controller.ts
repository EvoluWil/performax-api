import { Controller, Param, Post } from '@nestjs/common';
import { IsPublic } from 'src/decorators/public.decorator';
import { RecurringService } from './recurring.service';

@Controller('companies/:companyId/tasks/recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @IsPublic()
  @Post('generate-week')
  async generateWeek(@Param('companyId') companyId: string) {
    const created = await this.recurringService.generateForNextDays(
      companyId,
      7,
    );
    return { ok: true, createdCount: created.length, created };
  }
}
