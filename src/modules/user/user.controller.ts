import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { UpdateCoordinatesDto } from './dto/update-coordinates.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Put(':id/roles')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.userService.updateRole(id, updateRoleDto);
  }

  @Put(':id/coordinates')
  updateCoordinates(
    @Param('id') id: string,
    @Body() updateCoordinatesDto: UpdateCoordinatesDto,
  ) {
    return this.userService.updateCoordinates(id, updateCoordinatesDto);
  }

  @Put(':id/clients')
  updateClients(
    @Param('id') id: string,
    @Body() updateClientsDto: UpdateClientsDto,
  ) {
    return this.userService.updateClients(id, updateClientsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
