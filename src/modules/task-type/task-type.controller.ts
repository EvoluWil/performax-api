import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTaskTypeDto } from './dto/create-task-type.dto';
import { UpdateTaskTypeDto } from './dto/update-task-type.dto';
import { TaskTypeService } from './task-type.service';

@Controller('tasks-types')
export class TaskTypeController {
  constructor(private readonly taskTypeService: TaskTypeService) {}

  @Post()
  create(@Body() createTaskTypeDto: CreateTaskTypeDto) {
    return this.taskTypeService.create(createTaskTypeDto);
  }

  @Get()
  findAll() {
    return this.taskTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskTypeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskTypeDto: UpdateTaskTypeDto,
  ) {
    return this.taskTypeService.update(id, updateTaskTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskTypeService.remove(id);
  }
}
