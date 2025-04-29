import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

import 'reflect-metadata';

import { types } from 'pg';

/**
 * 자동으로 date 문자열을 js Date 객체로 변경하는 문제를 해결하기 위함.
 */
types.setTypeParser(1082, (val) => val);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 값은 자동으로 제거
      forbidNonWhitelisted: true, // DTO에 없는 필드를 보내면 에러 발생
      transform: true, // 타입 자동 변환
    }),
  );

  app.enableCors({ credentials: true });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
