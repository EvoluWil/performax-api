import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('companies/:companyId/users')
@RequirePermission('user', 'FILTER')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @RequirePermission('user', 'WRITE')
  create(
    @Body() createUserDto: CreateUserDto,
    @Param('companyId') companyId: string,
  ) {
    return this.userService.create(createUserDto, companyId);
  }

  @Get()
  findAll(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.userService.findAll(companyId, user.id);
  }

  @Get(':userId')
  @RequirePermission('user', 'READ')
  findOne(
    @Param('userId') userId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.userService.findOne(userId, companyId);
  }

  @Delete(':userId')
  @RequirePermission('user', 'ADMIN')
  remove(
    @Param('userId') userId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.userService.remove(userId, companyId);
  }
}
