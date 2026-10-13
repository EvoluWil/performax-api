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
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
import { OccurrenceService } from './occurrence.service';

@Controller('companies/:companyId/occurrences')
@RequirePermission('occurrence', 'READ')
export class OccurrenceController {
  constructor(private readonly occurrenceService: OccurrenceService) {}

  @Post()
  @RequirePermission('occurrence', 'WRITE')
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
  findAll(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.occurrenceService.findAll(companyId, user.id);
  }

  @Get(':occurrenceId')
  findOne(
    @Param('companyId') companyId: string,
    @Param('occurrenceId') occurrenceId: string,
  ) {
    return this.occurrenceService.findOne(occurrenceId, companyId);
  }

  @Put(':occurrenceId')
  @RequirePermission('occurrence', 'WRITE')
  update(
    @Param('companyId') companyId: string,
    @Param('occurrenceId') occurrenceId: string,
    @Body() updateOccurrenceDto: UpdateOccurrenceDto,
    @AuthUser() user: User,
  ) {
    return this.occurrenceService.update(
      occurrenceId,
      companyId,
      updateOccurrenceDto,
      user.id,
    );
  }

  @Put(':occurrenceId/approve')
  @RequirePermission('occurrence', 'ADMIN')
  approve(
    @Param('occurrenceId') occurrenceId: string,
    @Param('companyId') companyId: string,
    @Body('approved') approved: boolean,
    @AuthUser() user: User,
  ) {
    return this.occurrenceService.approve(
      occurrenceId,
      companyId,
      approved,
      user.id,
    );
  }

  @Delete(':occurrenceId')
  @RequirePermission('occurrence', 'ADMIN')
  remove(
    @Param('companyId') companyId: string,
    @Param('occurrenceId') occurrenceId: string,
  ) {
    return this.occurrenceService.remove(occurrenceId, companyId);
  }
}
