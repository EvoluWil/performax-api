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

@Controller('companies/:companyId/entry-types')
export class EntryTypeController {
  constructor(private readonly entryTypeService: EntryTypeService) {}

  @Post()
  create(
    @Body() createEntryTypeDto: CreateEntryTypeDto,
    @Param('companyId') companyId: string,
  ) {
    return this.entryTypeService.create(createEntryTypeDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.entryTypeService.findAll(companyId);
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
