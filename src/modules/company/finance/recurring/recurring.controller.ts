import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { RecurringService } from './recurring.service';

@Controller('companies/:companyId/finance-recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Get()
  findAll(companyId: string) {
    return this.recurringService.findAll(companyId);
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
