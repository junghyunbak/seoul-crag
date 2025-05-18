import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppVisited } from './app-visited.entity';
import { Repository } from 'typeorm';
import { CreateAppVisitedDto } from './dto/create-app-visited.dto';

export interface VisitedStats {
  date: string;
  count: number;
  unique_visitors: number;
  signed_users: number;
  pwa_visitors: number;
  web_visitors: number;
}

@Injectable()
export class AppVisitedService {
  constructor(
    @InjectRepository(AppVisited)
    private readonly visitedRepo: Repository<AppVisited>,
  ) {}

  async logVisit(
    userId: string | null,
    ip: string,
    { url, is_pwa }: CreateAppVisitedDto,
  ) {
    const record = this.visitedRepo.create({
      user_id: userId,
      ip,
      url,
      is_pwa,
    });

    await this.visitedRepo.save(record);
  }

  async getHourlyStats24h(): Promise<
    {
      kst_hour: string;
      signed_users: number;
      visit_count: number;
      unique_visit_count: number;
    }[]
  > {
    const result = await this.visitedRepo.query(`
      WITH hours AS (
        SELECT generate_series(
          date_trunc('hour', now() + interval '9 hours') - interval '17 hours',
          date_trunc('hour', now() + interval '9 hours'),
          interval '1 hour'
        ) AS kst_hour
      ),
      visits AS (
        SELECT
          date_trunc('hour', created_at + interval '9 hours') AS kst_hour,
          COUNT(*) AS visit_count,
          COUNT(DISTINCT ip) AS unique_visit_count,
          COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) AS signed_users
        FROM app_visited
        WHERE created_at >= now() - interval '2 days'
        GROUP BY kst_hour
      )
      SELECT
        to_char(h.kst_hour, 'YYYY-MM-DD HH24:00') AS kst_hour,
        COALESCE(v.visit_count, 0)::int AS visit_count,
        COALESCE(v.unique_visit_count, 0)::int AS unique_visit_count,
        COALESCE(v.signed_users, 0)::int AS signed_users
      FROM hours h
      LEFT JOIN visits v ON h.kst_hour = v.kst_hour
      ORDER BY h.kst_hour ASC;
    `);

    return result;
  }

  async getRecentVisitedStats(): Promise<VisitedStats[]> {
    const raw: VisitedStats[] = await this.visitedRepo.query(`
      SELECT
  to_char(created_at + interval '9 hours', 'YYYY-MM-DD') AS date,
  COUNT(*) AS count,
  COUNT(DISTINCT ip) AS unique_visitors,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) AS signed_users,
  COUNT(DISTINCT ip) FILTER (WHERE is_pwa = true) AS pwa_visitors,
  COUNT(DISTINCT ip) FILTER (WHERE is_pwa = false) AS web_visitors
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
        pwa_visitors: Number(row.pwa_visitors),
        web_visitors: Number(row.web_visitors),
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
