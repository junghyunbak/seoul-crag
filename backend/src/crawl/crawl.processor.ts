import { Processor, Process } from '@nestjs/bull';

import { Job } from 'bull';

import { FeedsService } from 'src/feeds/feeds.service';
import { GymsService } from 'src/gyms/gyms.service';

import * as path from 'path';

import { spawn } from 'child_process';

import { z } from 'zod';

const crawlingResultSchema = z.array(
  z.object({
    href: z.string(),
    imgPath: z.string(),
  }),
);

@Processor('crawl')
export class CrawlProcessor {
  constructor(
    private readonly gymsService: GymsService,
    private readonly feedsService: FeedsService,
  ) {}

  @Process({ name: 'crawl-job', concurrency: 1 })
  async handle(job: Job<{ gymId: string; websiteUrl: string }>) {
    const { gymId, websiteUrl } = job.data;

    console.log(`🚀 [크롤링 시작] ${websiteUrl}`);

    try {
      /**
       * 1. 스크립트를 통해 크롤링 후 데이터 반환받음.
       */
      const output = await new Promise<string>((resolve, reject) => {
        const crawlScript = spawn('npx', [
          'ts-node',
          path.join(__dirname, '..', '..', 'scripts', 'collect-feed.ts'),
        ]);

        crawlScript.stdin.write(JSON.stringify({ url: websiteUrl }));
        crawlScript.stdin.end();

        let output = '';
        let stderr = '';

        crawlScript.stdout.on('data', (data: Buffer) => {
          output += data.toString();
        });

        crawlScript.stderr.on('data', (data: Buffer) => {
          stderr += data.toString();
        });

        crawlScript.on('close', () => {
          if (stderr) {
            reject(new Error('크롤중 에러 발생: ' + stderr));
          } else {
            resolve(output);
          }
        });
      });

      /**
       * 2. 반환받은 데이터로 피드 생성
       */
      const result = crawlingResultSchema.parse(JSON.parse(output));

      const gym = await this.gymsService.findOne(gymId);

      const gymFeedUrls = gym.feeds.map((feed) => feed.url);

      for (const { href, imgPath } of result) {
        const isExist = gymFeedUrls.includes(href);

        if (!isExist) {
          await this.feedsService.createFeed(href, imgPath, gym);
        }
      }
    } catch (e) {
      console.log(e);
    }

    console.log(`✅ [크롤링 완료] ${websiteUrl}`);
  }
}
