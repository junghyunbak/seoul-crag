import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({ credentials: true });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
