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

@Controller('companies/:companyId/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Param('companyId') companyId: string,
  ) {
    return this.userService.create(createUserDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.userService.findAll(companyId);
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
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Param('companyId') companyId: string,
  ) {
    return this.userService.updateRole(id, updateRoleDto, companyId);
  }

  @Put(':id/coordinates')
  updateCoordinates(
    @Param('id') id: string,
    @Body() updateCoordinatesDto: UpdateCoordinatesDto,
    @Param('companyId') companyId: string,
  ) {
    return this.userService.updateCoordinates(
      id,
      updateCoordinatesDto,
      companyId,
    );
  }

  @Put(':id/clients')
  updateClients(
    @Param('id') id: string,
    @Body() updateClientsDto: UpdateClientsDto,
    @Param('companyId') companyId: string,
  ) {
    return this.userService.updateClients(id, updateClientsDto, companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Param('companyId') companyId: string) {
    return this.userService.remove(id, companyId);
  }
}
