import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CrawlService {
  constructor(@InjectQueue('crawl') private readonly crawlQueue: Queue) {}

  @Cron(CronExpression.EVERY_10_SECONDS) // 10초마다 실행
  async addCrawlJob() {
    console.log('🔄 크롤링 작업을 큐에 추가');
    await this.crawlQueue.add('crawl-job', { url: 'https://example.com' });
  }
}
