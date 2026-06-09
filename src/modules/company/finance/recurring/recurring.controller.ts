import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { RecurringService } from './recurring.service';

@Controller('companies/:companyId/finance-recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.recurringService.findAll(companyId);
  }

  @Get(':recurringId')
  findOne(
    @Param('recurringId') recurringId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.recurringService.findOne(recurringId, companyId);
  }

  @Post('process')
  process(@Param('companyId') companyId: string) {
    return this.recurringService.processRecurrences(companyId);
  }

  /**
   * Temporary route: eagerly generates (or completes) all occurrences for
   * every recurring master in the company. Safe to call multiple times.
   * Use this once for companies that had recurrences before the eager-
   * generation feature was introduced.
   */
  @Post('backfill')
  backfill(@Param('companyId') companyId: string) {
    return this.recurringService.backfillAll(companyId);
  }

  @Put(':recurringId')
  update(
    @Param('recurringId') recurringId: string,
    @Param('companyId') companyId: string,
    @Body() updateRecurringDto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(
      recurringId,
      companyId,
      updateRecurringDto,
    );
  }

  @Delete(':recurringId')
  remove(
    @Param('recurringId') recurringId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.recurringService.remove(recurringId, companyId);
  }
}
