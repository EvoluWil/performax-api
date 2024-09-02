import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UpdateRecurringFinancialDto } from './dto/update-recurring-financial.dto';
import { RecurringFinancialService } from './recurring-financial.service';

@Controller('recurring-financial')
export class RecurringFinancialController {
  constructor(
    private readonly recurringFinancialService: RecurringFinancialService,
  ) {}

  @Get()
  findAll() {
    return this.recurringFinancialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recurringFinancialService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecurringFinancialDto: UpdateRecurringFinancialDto,
  ) {
    return this.recurringFinancialService.update(
      id,
      updateRecurringFinancialDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recurringFinancialService.remove(id);
  }
}
