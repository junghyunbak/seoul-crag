import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './feeds.entity';
import { FeedController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { GymsModule } from 'src/gyms/gyms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feed]), GymsModule],
  controllers: [FeedController],
  providers: [FeedsService],
})
export class FeedsModule {}
