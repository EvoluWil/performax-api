import { Module } from '@nestjs/common';
import { MailService } from 'src/providers/mail/mail.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule {}
