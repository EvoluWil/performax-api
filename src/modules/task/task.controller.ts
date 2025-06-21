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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('companies/:companyId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @AuthUser() authUser: Request['user'],
    @Param('companyId') companyId: string,
  ) {
    return this.taskService.create(createTaskDto, authUser?.id, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.taskService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @AuthUser() authUser: Request['user'],
  ) {
    return this.taskService.update(id, updateTaskDto, authUser?.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
