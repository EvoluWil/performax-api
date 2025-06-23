import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from './jwt/jwt.modules';

import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule,
    PrismaModule,
    MailModule,
    AuthModule,
    CacheModule,
  ],
  providers: [],
  exports: [],
})
export class ProvidersModule {}
