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
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';

@Controller('checklists')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post()
  create(
    @Body() createChecklistDto: CreateChecklistDto,
    @AuthUser() authUser: Request['user'],
  ) {
    return this.checklistService.create(createChecklistDto, authUser?.id);
  }

  @Get()
  findAll() {
    return this.checklistService.findAll();
  }

  @Get(':checklistId')
  findOne(@Param('checklistId') checklistId: string) {
    return this.checklistService.findOne(checklistId);
  }

  @Put(':checklistId')
  update(
    @Param('checklistId') checklistId: string,
    @Body() updateChecklistDto: UpdateChecklistDto,
  ) {
    return this.checklistService.update(checklistId, updateChecklistDto);
  }

  @Delete(':checklistId')
  remove(@Param('checklistId') checklistId: string) {
    return this.checklistService.remove(checklistId);
  }
}
