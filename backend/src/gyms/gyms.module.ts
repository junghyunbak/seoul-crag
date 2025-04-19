import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymsController } from './gyms.controller';
import { GymsService } from './gyms.service';
import { Gym } from './gyms.entity';
import { GymImagesModule } from 'src/gym-images/gym-images.module';

@Module({
  imports: [TypeOrmModule.forFeature([Gym]), GymImagesModule],
  controllers: [GymsController],
  providers: [GymsService],
})
export class GymsModule {}
