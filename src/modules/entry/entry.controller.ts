import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { EntryService } from './entry.service';

@Controller('companies/:companyId/entries')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post()
  create(
    @Body() createEntryDto: CreateEntryDto,
    @AuthUser() authUser: Request['user'],
    @Param('companyId') companyId: string,
  ) {
    return this.entryService.create(createEntryDto, authUser?.id, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.entryService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entryService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEntryDto: UpdateEntryDto) {
    return this.entryService.update(id, updateEntryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entryService.remove(id);
  }
}
