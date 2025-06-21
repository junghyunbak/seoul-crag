import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CrawlService } from './crawl.service';
import { CrawlProcessor } from './crawl.processor';
import { GymsModule } from 'src/gyms/gyms.module';
import { FeedsModule } from 'src/feeds/feeds.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'crawl',
    }),
    GymsModule,
    FeedsModule,
  ],
  providers: [CrawlService, CrawlProcessor],
})
export class CrawlModule {}
