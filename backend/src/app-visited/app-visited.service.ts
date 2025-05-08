import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppVisited } from './app-visited.entity';
import { Repository } from 'typeorm';

export interface VisitedStatsRow {
  date: string;
  count: string;
  unique_visitors: string;
  signed_users: string;
}

export interface VisitedStats {
  date: string;
  count: number;
  unique_visitors: number;
  signed_users: number;
}

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

  async getRecentVisitedStats(): Promise<VisitedStats[]> {
    const raw: VisitedStatsRow[] = await this.visitedRepo.query(`
    SELECT
      to_char(created_at + interval '9 hours', 'YYYY-MM-DD') AS date,
      COUNT(*) AS count,
      COUNT(DISTINCT ip) AS unique_visitors,
      COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) AS signed_users
    FROM app_visited
    WHERE created_at >= now() - interval '7 days'
    GROUP BY date
    ORDER BY date ASC;
  `);

    return raw.map(
      (row): VisitedStats => ({
        date: row.date,
        count: Number(row.count),
        unique_visitors: Number(row.unique_visitors),
        signed_users: Number(row.signed_users),
      }),
    );
  }

  async getVisitStats(): Promise<{ date: string; count: number }[]> {
    const result = await this.visitedRepo
      .createQueryBuilder('visit')
      .select(
        "TO_CHAR((visit.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::date, 'YYYY-MM-DD')",
        'date',
      )
      .addSelect('COUNT(*)', 'count')
      .groupBy(
        "TO_CHAR((visit.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::date, 'YYYY-MM-DD')",
      )
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string; count: string }>();

    return result.map((row) => ({
      date: row.date,
      count: Number(row.count),
    }));
  }
}
