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

@Controller('companies/:companyId/occurrence-types')
export class OccurrenceTypeController {
  constructor(private readonly occurrenceTypeService: OccurrenceTypeService) {}

  @Post()
  create(
    @Body() createOccurrenceTypeDto: CreateOccurrenceTypeDto,
    @Param('companyId') companyId: string,
  ) {
    return this.occurrenceTypeService.create(
      createOccurrenceTypeDto,
      companyId,
    );
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.occurrenceTypeService.findAll(companyId);
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
