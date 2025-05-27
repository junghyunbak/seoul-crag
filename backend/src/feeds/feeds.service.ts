import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from './feeds.entity';
//import { Cron, CronExpression } from '@nestjs/schedule';
import { GymsV2Service } from 'src/gyms/gyms.v2.service';
import puppeteer from 'puppeteer';
import { ImageService } from 'src/image/image.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private readonly feedRepo: Repository<Feed>,
    private readonly gymsV2Service: GymsV2Service,
    private readonly imageService: ImageService,
  ) {}

  async updateFeed(id: string, isRead: boolean) {
    const feed = await this.feedRepo.findOne({ where: { id } });

    if (!feed) {
      throw new BadRequestException('Feed not found');
    }

    Object.assign(feed, { is_read: isRead });

    return this.feedRepo.save(feed);
  }

  //@Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const gyms = await this.gymsV2Service.findAll();

    const browser = await puppeteer.launch({
      headless: true,
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
          /**
           * 요소는 위에서부터 아래로 순서대로 가져와지므로,
           *
           * 역순으로 반환하여 가장 오래된 게시글이 먼저 데이터베이스에 저장되도록 한다.
           */
          anchors.reverse().map((anchor) => ({
            href: anchor.href,
            thumbnailSrc: anchor.querySelector('img')?.src || '',
          })),
        );

        for (const { href, thumbnailSrc } of anchors) {
          const exists = await this.existsPost(href);

          if (!exists) {
            const imgHandle = await page.$(`img[src^="${thumbnailSrc}"]`);

            const buffer = await imgHandle?.screenshot();

            let resizedImageUrl = '';

            if (buffer) {
              const filename = `thumbnail_${Date.now()}.png`;
              const filePath = path.join(
                __dirname,
                '..',
                '..',
                'uploads',
                filename,
              );

              fs.writeFileSync(filePath, buffer);

              resizedImageUrl = await this.imageService.compressImage(
                filePath,
                filename,
              );
            }

            const feed = this.feedRepo.create({
              url: href,
              is_read: false,
              thumbnail_url: resizedImageUrl,
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
