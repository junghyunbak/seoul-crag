import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envValidationSchema } from 'src/config/env.validation';
import { redisConfig } from 'src/config/redis.config';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { CrawlModule } from 'src/crawl/crawl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: redisConfig,
    }),
    BullModule.registerQueue({
      name: 'crawl',
    }),
    CrawlModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class WorkerModule {}
