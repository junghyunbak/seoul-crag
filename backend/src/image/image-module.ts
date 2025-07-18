import { Module } from '@nestjs/common';
import { ImageController } from 'src/image/image-controller';
import { ImageService } from './image.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
