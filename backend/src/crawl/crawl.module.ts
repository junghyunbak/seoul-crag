import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CrawlService } from './crawl.service';
import { CrawlProcessor } from './crawl.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'crawl',
    }),
  ],
  providers: [CrawlService, CrawlProcessor],
})
export class CrawlModule {}
