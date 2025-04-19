import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymImage } from './gym-images.entity';
import { GymImagesService } from 'src/gym-images/gym-images.service';

@Module({
  imports: [TypeOrmModule.forFeature([GymImage])],
  providers: [GymImagesService],
  exports: [TypeOrmModule, GymImagesService],
})
export class GymImagesModule {}
