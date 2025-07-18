import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GymUserContribution } from './gym-user-contributions.entity';
import { Repository } from 'typeorm';
import { CreateGymUserContributionDto } from './dto/create-gym-user-contributions.dto';

@Injectable()
export class GymUserContributionService {
  constructor(
    @InjectRepository(GymUserContribution)
    private readonly gymUserContributionRepo: Repository<GymUserContribution>,
  ) {}

  async findAll() {
    return this.gymUserContributionRepo.find();
  }

  async create(createGymUserContributionDto: CreateGymUserContributionDto) {
    const { userId, gymId, contributionId, description } =
      createGymUserContributionDto;

    const gymUserContribution = this.gymUserContributionRepo.create({
      gym: { id: gymId },
      user: { id: userId },
      contribution: { id: contributionId },
      description,
    });

    return this.gymUserContributionRepo.save(gymUserContribution);
  }

  async delete(gymUserContributionId: string) {
    return this.gymUserContributionRepo.delete({
      id: gymUserContributionId,
    });
  }

  async update(contributionId: string, description: string) {
    const gymUserContribution = await this.gymUserContributionRepo.findOne({
      where: {
        id: contributionId,
      },
    });

    if (!gymUserContribution) {
      throw new NotFoundException('해당 암장을 찾을 수 없습니다.');
    }

    Object.assign(gymUserContribution, { description });

    return this.gymUserContributionRepo.save(gymUserContribution);
  }
}
