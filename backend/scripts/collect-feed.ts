import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { AppDataSource } from 'src/config/data-source';
import { Feed } from 'src/feeds/feeds.entity';
import { Gym } from 'src/gyms/gyms.entity';

async function run() {
  await AppDataSource.initialize();

  const gymRepo = AppDataSource.getRepository(Gym);
  const feedRepo = AppDataSource.getRepository(Feed);

  const gyms = await gymRepo.find();

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './puppeteer_session',
  });

  const page = await browser.newPage();

  for (const gym of gyms) {
    const url = gym.website_url;

    if (!url) {
      continue;
    }

    try {
      await page.goto(url, {
        waitUntil: 'networkidle2',
      });

      try {
        await page.waitForFunction(
          () => {
            const count = document.querySelectorAll('a[href*="/p/"]').length;

            return count >= 12;
          },
          { timeout: 10000 },
        );
      } catch (e) {
        console.log('12개 미만의 요소를 발견하였습니다.', e);
      }

      const anchors = await page.$$eval('a[href*="/p/"]', (anchors) =>
        anchors.reverse().map((anchor) => ({
          href: anchor.href,
          thumbnailSrc: anchor.querySelector('img')?.src || '',
        })),
      );

      for (const { href, thumbnailSrc } of anchors) {
        const post = await feedRepo.findOne({ where: { url: href } });

        if (post) {
          continue;
        }

        const imgHandle = await page.$(`img[src^="${thumbnailSrc}"]`);

        const buffer = await imgHandle?.screenshot();

        let imagePath = '';

        if (buffer) {
          const filename = `thumbnail_${Date.now()}.png`;
          const filePath = path.join(__dirname, '..', 'uploads', filename);

          fs.writeFileSync(filePath, buffer);

          imagePath = `/uploads/${filename}`;
        }

        const feed = feedRepo.create({
          url: href,
          is_read: false,
          thumbnail_url: imagePath,
          gym: gym,
        });

        await feedRepo.save(feed);
      }

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.log('[에러 발생]', error);
    }
  }

  await browser.close();
}

run().catch((e) => console.error(e));
