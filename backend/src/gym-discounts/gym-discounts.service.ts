import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGymDiscountDto } from 'src/gym-discounts/dto/create-gym-discount.dto';
import { UpdateGymDiscountDto } from 'src/gym-discounts/dto/update-gym-discount.dto';
import { GymDiscount } from 'src/gym-discounts/gym-discounts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GymDiscountsService {
  constructor(
    @InjectRepository(GymDiscount)
    private readonly gymDiscountRepo: Repository<GymDiscount>,
  ) {}

  async findAll(gymId: string) {
    return await this.gymDiscountRepo.find({ where: { gym: { id: gymId } } });
  }

  async addGymDiscount(gymId: string, gymDiscountDto: CreateGymDiscountDto) {
    const gymDiscount = this.gymDiscountRepo.create({
      gym: { id: gymId },
      ...gymDiscountDto,
    });

    return await this.gymDiscountRepo.save(gymDiscount);
  }

  async updateGymDiscount(
    gymDiscountId: string,
    updateGymDiscountDto: UpdateGymDiscountDto,
  ) {
    const gymDiscount = await this.gymDiscountRepo.findOne({
      where: { id: gymDiscountId },
    });

    if (!gymDiscount) {
      return new BadRequestException();
    }

    Object.assign(gymDiscount, updateGymDiscountDto);

    return await this.gymDiscountRepo.save(gymDiscount);
  }

  async removeGymDiscount(gymId: string, gymDiscountId: string) {
    const gymDiscount = await this.gymDiscountRepo.findOne({
      where: { id: gymDiscountId },
    });

    // TODO: gym id 체크 활성화
    if (!gymDiscount /* || gymDiscount.gym.id !== gymId*/) {
      return new BadRequestException();
    }

    return await this.gymDiscountRepo.remove(gymDiscount);
  }
}
