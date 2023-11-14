import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    origin: ['http://localhost:5173'],
    allowedHeaders: [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'Observe',
      'X-Authorization',
      'X-Token-Auth',
      'Authorization',
    ],
    methods: 'GET, POST, PUT, DELETE, UPDATE, OPTIONS',
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT);
}
bootstrap();
