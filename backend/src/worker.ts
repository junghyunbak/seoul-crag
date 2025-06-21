import { NestFactory } from '@nestjs/core';
import { WorkerModule } from 'src/worker.module';

async function bootstrap() {
  // context로 애플리케이션을 생성하여 http 서버를 실행하지 않음.
  // 이 방식은 백그라운드 작업이나 스케줄러에 적합합니다.
  const app = await NestFactory.createApplicationContext(WorkerModule);
}
bootstrap();
