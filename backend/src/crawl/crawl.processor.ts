import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('crawl')
export class CrawlProcessor {
  @Process('crawl-job')
  handle(job: Job) {
    const { url } = job.data;

    console.log(`🚀 [크롤링 시작] ${url}`);

    // 여기서 Puppeteer 크롤링 로직 넣기
    // ex) const browser = await puppeteer.launch();

    console.log(`✅ [크롤링 완료] ${url}`);
  }
}
