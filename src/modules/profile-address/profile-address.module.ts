import { Module } from '@nestjs/common';
import { ProfileAddressController } from './profile-address.controller';
import { ProfileAddressService } from './profile-address.service';

@Module({
  controllers: [ProfileAddressController],
  providers: [ProfileAddressService],
})
export class ProfileAddressModule {}
