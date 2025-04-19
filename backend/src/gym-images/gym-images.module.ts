import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymImage } from './gym-images.entity';
import { GymImagesService } from './gym-images.service';
import { GymImagesController } from './gym-images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GymImage])],
  controllers: [GymImagesController],
  providers: [GymImagesService],
  exports: [TypeOrmModule, GymImagesService],
})
export class GymImagesModule {}
