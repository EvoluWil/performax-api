import { Module } from '@nestjs/common';
import { MailModule } from 'src/providers/mail/mail.module';
import { UserController } from './index/user.controller';
import { UserService } from './index/user.service';
import { RoleModule } from './role/role.module';

@Module({
  imports: [MailModule, RoleModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
