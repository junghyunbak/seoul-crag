import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from './feeds.entity';
import { GymsV2Service } from 'src/gyms/gyms.v2.service';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
    private readonly gymsV2Service: GymsV2Service,
    private readonly imageService: ImageService,
  ) {}

  async updateFeed(id: string, isRead: boolean) {
    const feed = await this.feedRepo.findOne({ where: { id } });

    if (!feed) {
      throw new BadRequestException('Feed not found');
    }

    Object.assign(feed, { is_read: isRead });

    return this.feedRepo.save(feed);
  }

  async findAllByGym(gymId: string) {
    return this.feedRepo.find({ where: { gym: { id: gymId } } });
  }
}
