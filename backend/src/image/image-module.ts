import { Module } from '@nestjs/common';
import { ImageController } from 'src/image/image-controller';

@Module({
  controllers: [ImageController],
})
export class ImageModule {}
