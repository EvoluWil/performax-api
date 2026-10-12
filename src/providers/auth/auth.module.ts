import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { AdminOnlyGuard } from './admin-only.guard';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { PermissionGuard } from './permission.guard';

@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: AdminOnlyGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: PermissionGuard,
    },
  ],
})
export class AuthModule {}
