import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GymOpeningHour } from './gym-opening-hours.entity';
import { CreateOpeningHourDto } from './dto/create-opening-hour.dto';
import { Gym } from '../gyms/gyms.entity';

@Injectable()
export class GymOpeningHoursService {
  constructor(
    @InjectRepository(GymOpeningHour)
    private readonly openingRepo: Repository<GymOpeningHour>,

    @InjectRepository(Gym)
    private readonly gymRepo: Repository<Gym>,
  ) {}

  async upsertOpeningHour(
    gymId: string,
    dto: CreateOpeningHourDto,
  ): Promise<GymOpeningHour> {
    const gym = await this.gymRepo.findOneByOrFail({ id: gymId });

    const existing = await this.openingRepo.findOne({
      where: {
        gym: { id: gymId },
        day: dto.day,
      },
      relations: ['gym'],
    });

    if (existing) {
      Object.assign(existing, dto);
      return this.openingRepo.save(existing);
    }

    const newHour = this.openingRepo.create({ ...dto, gym });
    return this.openingRepo.save(newHour);
  }

  async getOpeningHours(gymId: string): Promise<GymOpeningHour[]> {
    return this.openingRepo.find({
      where: { gym: { id: gymId } },
      order: { day: 'ASC' },
    });
  }
}
