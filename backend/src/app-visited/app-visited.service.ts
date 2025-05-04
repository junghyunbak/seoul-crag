import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppVisited } from './app-visited.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppVisitedService {
  constructor(
    @InjectRepository(AppVisited)
    private readonly visitedRepo: Repository<AppVisited>,
  ) {}

  async logVisit(userId: string | null, ip: string, url: string) {
    const record = this.visitedRepo.create({ user_id: userId, ip, url });

    await this.visitedRepo.save(record);
  }
}
