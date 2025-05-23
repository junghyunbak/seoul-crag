import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserV2Service {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getUser(userId: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: {
        id: userId,
      },
      relations: [
        'gymUserContributions',
        'gymUserContributions.gym',
        'gymUserContributions.contribution',
        'comments',
        'userRoles',
      ],
    });
  }

  async getUsers(): Promise<User[] | null> {
    return await this.userRepo.find({
      relations: [
        'gymUserContributions',
        'gymUserContributions.gym',
        'gymUserContributions.contribution',
        'comments',
        'userRoles',
      ],
    });
  }
}
