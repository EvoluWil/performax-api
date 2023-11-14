import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthUserDto } from 'src/providers/auth/dto/auth-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(
    @AuthUser() authUser: AuthUserDto,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.create(authUser.id, createProfileDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }
}
