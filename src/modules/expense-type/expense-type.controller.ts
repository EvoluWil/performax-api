import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { ExpenseTypeService } from './expense-type.service';

@Controller('expense-types')
export class ExpenseTypeController {
  constructor(private readonly expenseTypeService: ExpenseTypeService) {}

  @Post()
  create(@Body() createExpenseTypeDto: CreateExpenseTypeDto) {
    return this.expenseTypeService.create(createExpenseTypeDto);
  }

  @Get()
  findAll() {
    return this.expenseTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseTypeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseTypeDto: UpdateExpenseTypeDto,
  ) {
    return this.expenseTypeService.update(id, updateExpenseTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseTypeService.remove(id);
  }
}
