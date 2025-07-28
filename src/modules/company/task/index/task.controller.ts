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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('companies/:companyId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.taskService.create(createTaskDto, companyId, user.id);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.taskService.findAll(companyId);
  }

  @Get(':taskId')
  findOne(
    @Param('taskId') taskId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.taskService.findOne(taskId, companyId);
  }

  @Put(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Param('companyId') companyId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(taskId, companyId, updateTaskDto);
  }

  @Delete(':taskId')
  remove(
    @Param('taskId') taskId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.taskService.remove(taskId, companyId);
  }
}
