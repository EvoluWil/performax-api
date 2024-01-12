import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('users/:userId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('userId') userId: string,
  ) {
    return this.taskService.create(createTaskDto, userId);
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.taskService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
