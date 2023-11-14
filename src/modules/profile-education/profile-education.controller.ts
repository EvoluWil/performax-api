import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthUserDto } from 'src/providers/auth/dto/auth-user.dto';
import { CreateProfileEducationDto } from './dto/create-profile-education.dto';
import { UpdateProfileEducationDto } from './dto/update-profile-education.dto';
import { ProfileEducationService } from './profile-education.service';

@Controller('profile-educations')
export class ProfileEducationController {
  constructor(
    private readonly profileEducationService: ProfileEducationService,
  ) {}

  @Post()
  create(
    @AuthUser() authUser: AuthUserDto,
    @Body() createProfileEducationDto: CreateProfileEducationDto,
  ) {
    return this.profileEducationService.create(
      authUser.id,
      createProfileEducationDto,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileEducationDto: UpdateProfileEducationDto,
  ) {
    return this.profileEducationService.update(id, updateProfileEducationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileEducationService.remove(id);
  }
}
