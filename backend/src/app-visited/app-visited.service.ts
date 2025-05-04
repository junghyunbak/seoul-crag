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

  async getVisitStats(): Promise<{ date: string; count: number }[]> {
    const raw = await this.visitedRepo.query(`
      SELECT 
        to_char(created_at::date, 'YYYY-MM-DD') AS date,
        COUNT(*) AS count
      FROM app_visited
      GROUP BY created_at::date
      ORDER BY created_at::date;
    `);

    return raw.map((row) => ({
      date: row.date,
      count: Number(row.count),
    }));
  }
}
