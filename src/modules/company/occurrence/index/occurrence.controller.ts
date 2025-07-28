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
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { OccurrenceService } from './occurrence.service';

@Controller('companies/:companyId/occurrences')
export class OccurrenceController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createOccurrenceDto: CreateOccurrenceDto,
    @AuthUser() user: User,
  ) {
    return this.occurrenceService.create(
      createOccurrenceDto,
      companyId,
      user.id,
    );
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.occurrenceService.findAll(companyId);
  }

  @Get(':occurrenceId')
  findOne(
    @Param('companyId') companyId: string,
    @Param('occurrenceId') occurrenceId: string,
  ) {
    return this.occurrenceService.findOne(companyId, occurrenceId);
  }

  @Put(':occurrenceId')
  update(
    @Param('companyId') companyId: string,
    @Param('occurrenceId') occurrenceId: string,
    @Body() updateOccurrenceDto: UpdateOccurrenceDto,
  ) {
    return this.occurrenceService.update(
      companyId,
      occurrenceId,
      updateOccurrenceDto,
    );
  }

  @Delete(':occurrenceId')
  remove(
    @Param('companyId') companyId: string,
    @Param('occurrenceId') occurrenceId: string,
  ) {
    return this.occurrenceService.remove(companyId, occurrenceId);
  }
}
