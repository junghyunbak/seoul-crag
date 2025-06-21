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

  const result: { href: string; imgPath: string }[] = [];

  for (const { href, thumbnailSrc } of anchors) {
    const imgHandle = await page.$(`img[src^="${thumbnailSrc}"]`);

    const imgPath = await (async () => {
      if (!imgHandle) {
        return '';
      }

      const uint8 = await imgHandle.screenshot();

      const filename = `thumbnail_${Date.now()}.png`;
      const filePath = path.join(__dirname, '..', 'uploads', filename);

      fs.writeFileSync(filePath, uint8);

      const imagePath = `/uploads/${filename}`;

      return imagePath;
    })();

    result.push({
      href,
      imgPath,
    });
  }

  await page.close();
  await browser.close();

  console.log(JSON.stringify(result, null, 2));
}
