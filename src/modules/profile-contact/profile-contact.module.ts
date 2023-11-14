import { Module } from '@nestjs/common';
import { ProfileContactService } from './profile-contact.service';
import { ProfileContactController } from './profile-contact.controller';

@Module({
  controllers: [ProfileContactController],
  providers: [ProfileContactService]
})
export class ProfileContactModule {}
