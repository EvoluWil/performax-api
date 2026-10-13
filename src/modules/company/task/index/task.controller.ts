import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskMine, TaskService } from './task.service';

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
    @Req() request: { query: Record<string, unknown> },
  ) {
    const mine = readMine(request.query.mine);
    delete request.query.mine;
    return this.taskService.findAll(companyId, user.id, mine);
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
    @AuthUser() user: User,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(taskId, companyId, updateTaskDto, user.id);
  }

  @Put(':taskId/approve')
  @RequirePermission('task', 'ADMIN')
  approve(
    @Param('taskId') taskId: string,
    @Param('companyId') companyId: string,
    @Body('approved') approved: boolean,
    @AuthUser() user: User,
  ) {
    return this.taskService.approve(taskId, companyId, approved, user.id);
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

function readMine(value: unknown): TaskMine | undefined {
  if (value === 'assigned' || value === 'created') return value;
  return undefined;
}
