import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEntryTypeDto } from './dto/create-entry-type.dto';
import { UpdateEntryTypeDto } from './dto/update-entry-type.dto';
import { EntryTypeService } from './entry-type.service';

@Controller('entry-types')
export class EntryTypeController {
  constructor(private readonly entryTypeService: EntryTypeService) {}

  @Post()
  create(@Body() createEntryTypeDto: CreateEntryTypeDto) {
    return this.entryTypeService.create(createEntryTypeDto);
  }

  @Get()
  findAll() {
    return this.entryTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entryTypeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEntryTypeDto: UpdateEntryTypeDto,
  ) {
    return this.entryTypeService.update(id, updateEntryTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entryTypeService.remove(id);
  }
}
