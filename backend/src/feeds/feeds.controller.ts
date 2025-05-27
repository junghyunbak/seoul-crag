import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedsService } from './feeds.service';

@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedsService) {}

  @Patch(':id')
  async updateFeed(@Param('id') feedId: string, @Body() body: UpdateFeedDto) {
    return await this.feedService.updateFeed(feedId, body.is_read);
  }
}
