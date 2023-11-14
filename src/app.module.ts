import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModulesModule } from './modules/modules.module';
import { EnsureAuthenticated } from './providers/middlewares/ensure.authenticated.middleware';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      isGlobal: true,
    }),
    ProvidersModule,
    ModulesModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {
  ensureAuthenticatedExclude = [
    { path: '/v1/auth/sign-in', method: RequestMethod.POST },
    { path: '/v1/auth/sign-up', method: RequestMethod.POST },
    { path: '/v1/auth/forgot-password', method: RequestMethod.POST },
    { path: '/v1/auth/validate-token/:token', method: RequestMethod.GET },
    { path: '/v1/auth/recovery-password/:token', method: RequestMethod.POST },
  ];

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticated)
      .exclude(...this.ensureAuthenticatedExclude)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
