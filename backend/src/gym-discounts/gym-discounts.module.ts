import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymDiscountsController } from 'src/gym-discounts/gym-discounts.controller';
import { GymDiscount } from 'src/gym-discounts/gym-discounts.entity';
import { GymsService } from 'src/gyms/gyms.service';

@Module({
  imports: [TypeOrmModule.forFeature([GymDiscount])],
  controllers: [GymDiscountsController],
  providers: [GymsService],
})
export class GymDiscountsModule {}
