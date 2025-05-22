import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from './contribution.entity';
import { Repository } from 'typeorm';
import { CreateContributionDto } from './dto/create-contribution.dto';

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepo: Repository<Contribution>,
  ) {}

  async findAll() {
    return this.contributionRepo.find();
  }

  async create(contributionDto: CreateContributionDto) {
    const existing = await this.contributionRepo.findOne({
      where: {
        name: contributionDto.name,
      },
    });

    if (existing) {
      return existing;
    }

    const contribution = this.contributionRepo.create(contributionDto);

    return this.contributionRepo.save(contribution);
  }

  async delete(contributionId: string) {
    await this.contributionRepo.delete({
      id: contributionId,
    });
  }
}
