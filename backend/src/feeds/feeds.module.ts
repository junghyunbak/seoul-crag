import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './feeds.entity';
import { FeedController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { GymsModule } from 'src/gyms/gyms.module';
import { ImageModule } from 'src/image/image-module';

@Module({
  imports: [TypeOrmModule.forFeature([Feed]), GymsModule, ImageModule],
  controllers: [FeedController],
  providers: [FeedsService],
})
export class FeedsModule {}
