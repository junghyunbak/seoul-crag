import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymsController } from './gyms.controller';
import { GymsService } from './gyms.service';
import { Gym } from './gyms.entity';
import { GymImagesModule } from 'src/gym-images/gym-images.module';
import { GymsV2Controller } from './gyms.v2.controller';
import { GymsV2Service } from './gyms.v2.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gym]), GymImagesModule],
  controllers: [GymsController, GymsV2Controller],
  providers: [GymsService, GymsV2Service],
  exports: [GymsV2Service],
})
export class GymsModule {}
