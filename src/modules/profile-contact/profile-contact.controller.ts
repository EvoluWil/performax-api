import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthUserDto } from 'src/providers/auth/dto/auth-user.dto';
import { CreateProfileContactDto } from './dto/create-profile-contact.dto';
import { UpdateProfileContactDto } from './dto/update-profile-contact.dto';
import { ProfileContactService } from './profile-contact.service';

@Controller('profile-contacts')
export class ProfileContactController {
  constructor(private readonly profileContactService: ProfileContactService) {}

  @Post()
  create(
    @AuthUser() authUser: AuthUserDto,
    @Body() createProfileContactDto: CreateProfileContactDto,
  ) {
    return this.profileContactService.create(
      authUser.id,
      createProfileContactDto,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileContactDto: UpdateProfileContactDto,
  ) {
    return this.profileContactService.update(id, updateProfileContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileContactService.remove(id);
  }
}
