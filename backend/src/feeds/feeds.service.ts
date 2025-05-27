import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from './feeds.entity';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
  ) {}

  async updateFeed(id: string, isRead: boolean) {
    const feed = await this.feedRepo.findOne({ where: { id } });

    if (!feed) {
      throw new BadRequestException('Feed not found');
    }

    Object.assign(feed, { is_read: isRead });

    return this.feedRepo.save(feed);
  }
}
