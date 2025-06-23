import puppeteer from 'puppeteer';
import { z } from 'zod';

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const crawlingUrlSchema = z.object({
  url: z.string().url(),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const stdin: string[] = [];

rl.on('line', (line) => {
  stdin.push(line);
});

rl.on('close', () => {
  const { url } = crawlingUrlSchema.parse(JSON.parse(stdin.join('\n')));

  crawling(url);
});

async function crawling(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    userDataDir: './puppeteer_session',
  });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('a[href*="/p/"]');

  const anchors = await page.$$eval('a[href*="/p/"]', (anchors) =>
    anchors.reverse().map((anchor) => ({
      href: anchor.href,
      thumbnailSrc: anchor.querySelector('img')?.src || '',
    })),
  );

  const result: { href: string; imgPath: string; imgLocalFilePath: string }[] =
    [];

  for (const { href, thumbnailSrc } of anchors) {
    const imgHandle = await page.$(`img[src^="${thumbnailSrc}"]`);

    const { imgPath, imgLocalFilePath } = await (async (): Promise<{
      imgPath: string;
      imgLocalFilePath: string;
    }> => {
      if (!imgHandle) {
        return {
          imgPath: '',
          imgLocalFilePath: '',
        };
      }

      const uint8 = await imgHandle.screenshot();

      const filename = `thumbnail_${Date.now()}.png`;
      const filePath = path.join(__dirname, '..', 'uploads', filename);

      await new Promise((resolve, reject) => {
        fs.writeFile(filePath, uint8, (err) => {
          if (err) {
            reject(new Error('파일 저장 실패'));
          } else {
            resolve(true);
          }
        });
      });

      fs.writeFileSync(filePath, uint8);

      const imgPath = `/uploads/${filename}`;

      return {
        imgPath,
        imgLocalFilePath: filePath,
      };
    })();

    result.push({
      href,
      imgPath,
      imgLocalFilePath,
    });
  }

  await page.close();
  await browser.close();

  console.log(JSON.stringify(result, null, 2));
}
