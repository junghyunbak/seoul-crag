import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GymsService } from 'src/gyms/gyms.service';

@Injectable()
export class CrawlService {
  constructor(
    @InjectQueue('crawl') private readonly crawlQueue: Queue,
    private readonly gymsService: GymsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async addCrawlJob() {
    const gyms = await this.gymsService.findAll();

    const filteredGyms = gyms
      .map((gym) => ({ websiteUrl: gym.website_url || '', gymId: gym.id }))
      .filter(({ websiteUrl }) => websiteUrl.includes('instagram.com'));

    for (const data of filteredGyms) {
      await this.crawlQueue.add('crawl-job', data);
    }
  }
}
