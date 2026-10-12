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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('companies/:companyId/tasks')
@RequirePermission('task', 'READ')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @RequirePermission('task', 'WRITE')
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.taskService.create(createTaskDto, companyId, user.id);
  }

  @Get()
  findAll(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.taskService.findAll(companyId, user.id);
  }

  @Get(':taskId')
  findOne(
    @Param('taskId') taskId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.taskService.findOne(taskId, companyId);
  }

  @Put(':taskId')
  @RequirePermission('task', 'WRITE')
  update(
    @Param('taskId') taskId: string,
    @Param('companyId') companyId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(taskId, companyId, updateTaskDto);
  }

  @Put(':taskId/approve')
  @RequirePermission('task', 'ADMIN')
  approve(
    @Param('taskId') taskId: string,
    @Param('companyId') companyId: string,
    @Body('approved') approved: boolean,
  ) {
    return this.taskService.approve(taskId, companyId, approved);
  }

  @Delete(':taskId')
  @RequirePermission('task', 'ADMIN')
  remove(
    @Param('taskId') taskId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.taskService.remove(taskId, companyId);
  }
}
