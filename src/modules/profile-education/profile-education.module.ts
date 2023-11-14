import { Module } from '@nestjs/common';
import { ProfileEducationController } from './profile-education.controller';
import { ProfileEducationService } from './profile-education.service';

@Module({
  controllers: [ProfileEducationController],
  providers: [ProfileEducationService],
})
export class ProfileEducationModule {}
