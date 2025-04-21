import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GymSchedule } from './gym-schedules.entity';
import { CreateGymScheduleDto } from './dto/create-gym-schedules.dto';
import { Gym } from '../gyms/gyms.entity';

@Injectable()
export class GymScheduleService {
  constructor(
    @InjectRepository(GymSchedule)
    private readonly scheduleRepo: Repository<GymSchedule>,

    @InjectRepository(Gym)
    private readonly gymRepo: Repository<Gym>,
  ) {}

  async create(dto: CreateGymScheduleDto): Promise<GymSchedule> {
    const gym = await this.gymRepo.findOneByOrFail({ id: dto.gymId });
    const schedule = this.scheduleRepo.create({
      gym,
      date: dto.date,
      type: dto.type,
      reason: dto.reason,
      is_regular: dto.is_regular ?? false,
    });
    return this.scheduleRepo.save(schedule);
  }

  async findByGymId(gymId: string): Promise<GymSchedule[]> {
    return this.scheduleRepo.find({
      where: { gym: { id: gymId } },
      order: { date: 'ASC' },
    });
  }
}
