import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
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
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.entryService.create(createEntryDto, companyId, user.id);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.entryService.findAll(companyId);
  }

  @Get(':entryId')
  findOne(
    @Param('entryId') entryId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.entryService.findOne(entryId, companyId);
  }

  @Put(':entryId')
  update(
    @Param('entryId') entryId: string,
    @Param('companyId') companyId: string,
    @Body() updateEntryDto: UpdateEntryDto,
  ) {
    return this.entryService.update(entryId, companyId, updateEntryDto);
  }

  @Delete(':entryId')
  remove(
    @Param('entryId') entryId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.entryService.remove(entryId, companyId);
  }
}
