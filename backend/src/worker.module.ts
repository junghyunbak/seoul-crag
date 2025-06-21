import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { redisConfig } from 'src/config/redis.config';
import { CrawlModule } from 'src/crawl/crawl.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CommonModule,

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
