import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { JwtModule } from './jwt/jwt.modules';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule,
    PrismaModule,
    MailModule,
    AuthModule,
    CacheModule,
    UtilModule,
  ],
  providers: [],
  exports: [],
})
export class ProvidersModule {}
