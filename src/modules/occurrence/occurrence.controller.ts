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
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { OccurrenceService } from './occurrence.service';

@Controller('occurrences')
export class OccurrenceController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

  @Post()
  create(
    @Body() createOccurrenceDto: CreateOccurrenceDto,
    @AuthUser() user: Request['user'],
  ) {
    return this.occurrenceService.create(createOccurrenceDto, user?.id);
  }

  @Get()
  findAll() {
    return this.occurrenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.occurrenceService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateOccurrenceDto: UpdateOccurrenceDto,
  ) {
    return this.occurrenceService.update(id, updateOccurrenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.occurrenceService.remove(id);
  }
}
