import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthUserDto } from 'src/providers/auth/dto/auth-user.dto';
import { CreateProfileAddressDto } from './dto/create-profile-address.dto';
import { UpdateProfileAddressDto } from './dto/update-profile-address.dto';
import { ProfileAddressService } from './profile-address.service';

@Controller('profile-address')
export class ProfileAddressController {
  constructor(private readonly profileAddressService: ProfileAddressService) {}

  @Post()
  create(
    @AuthUser() authUser: AuthUserDto,
    @Body() createProfileAddressDto: CreateProfileAddressDto,
  ) {
    return this.profileAddressService.create(
      authUser.id,
      createProfileAddressDto,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfileAddressDto: UpdateProfileAddressDto,
  ) {
    return this.profileAddressService.update(id, updateProfileAddressDto);
  }
}
