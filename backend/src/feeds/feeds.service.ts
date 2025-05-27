import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from './feeds.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GymsV2Service } from 'src/gyms/gyms.v2.service';
import puppeteer from 'puppeteer';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
    private readonly gymsV2Service: GymsV2Service,
  ) {}

  async updateFeed(id: string, isRead: boolean) {
    const feed = await this.feedRepo.findOne({ where: { id } });

    if (!feed) {
      throw new BadRequestException('Feed not found');
    }

    Object.assign(feed, { is_read: isRead });

    return this.feedRepo.save(feed);
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleCron() {
    const gyms = await this.gymsV2Service.findAll();

    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: './puppeteer_session',
    });

    const page = await browser.newPage();

    for (const gym of gyms) {
      const url = gym.website_url;

      try {
        await page.goto(url, {
          waitUntil: 'networkidle2',
        });

        await page.waitForSelector('a[href*="/p/"]');

        const anchors = await page.$$eval('a[href*="/p/"]', (anchors) =>
          anchors.map((anchor) => ({
            href: anchor.href,
            thumbnailSrc: anchor.querySelector('img')?.src || '',
          })),
        );

        for (const { href, thumbnailSrc } of anchors) {
          const exists = await this.existsPost(href);

          if (!exists) {
            const feed = this.feedRepo.create({
              url: href,
              is_read: false,
              thumbnail_url: thumbnailSrc,
              gym: gym,
            });

            await this.feedRepo.save(feed);
          }
        }

        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 2000);
        });
      } catch (error) {
        console.log('페이지를 가져오지 못했습니다.', error);
      }
    }

    await browser.close();
  }

  async existsPost(href: string): Promise<boolean> {
    const post = await this.feedRepo.findOne({ where: { url: href } });

    return !!post;
  }
}
