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

@Controller('companies/:companyId/occurrences')
export class OccurrenceController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

  @Post()
  create(
    @Body() createOccurrenceDto: CreateOccurrenceDto,
    @AuthUser() user: Request['user'],
    @Param('companyId') companyId: string,
  ) {
    return this.occurrenceService.create(
      createOccurrenceDto,
      user?.id,
      companyId,
    );
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.occurrenceService.findAll(companyId);
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
