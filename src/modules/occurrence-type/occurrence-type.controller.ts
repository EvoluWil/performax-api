import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateOccurrenceTypeDto } from './dto/create-occurrence-type.dto';
import { UpdateOccurrenceTypeDto } from './dto/update-occurrence-type.dto';
import { OccurrenceTypeService } from './occurrence-type.service';

@Controller('occurrence-types')
export class OccurrenceTypeController {
  constructor(private readonly occurrenceTypeService: OccurrenceTypeService) {}

  @Post()
  create(@Body() createOccurrenceTypeDto: CreateOccurrenceTypeDto) {
    return this.occurrenceTypeService.create(createOccurrenceTypeDto);
  }

  @Get()
  findAll() {
    return this.occurrenceTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.occurrenceTypeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateOccurrenceTypeDto: UpdateOccurrenceTypeDto,
  ) {
    return this.occurrenceTypeService.update(id, updateOccurrenceTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.occurrenceTypeService.remove(id);
  }
}
