import { Module } from '@nestjs/common';
import { EmailService } from 'src/providers/email/email.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
