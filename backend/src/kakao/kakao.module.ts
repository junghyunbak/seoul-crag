import { Module } from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { KakaoService } from './kakao.service';

@Module({
  imports: [],
  controllers: [KakaoController],
  providers: [KakaoService],
})
export class KakaoModule {}
