import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from './feeds.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GymsV2Service } from 'src/gyms/gyms.v2.service';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
    private readonly gymsV2Service: GymsV2Service,
  ) {}

  async updateFeed(id: string, isRead: boolean) {
    const feed = await this.feedRepo.findOne({ where: { id } });

    if (!feed) {
      throw new BadRequestException('Feed not found');
    }

    Object.assign(feed, { is_read: isRead });

    return this.feedRepo.save(feed);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const gyms = await this.gymsV2Service.findAll();

    console.log(
      '테스트',
      gyms.map((gym) => gym.name),
    );
  }
}
