import { Controller, Query, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GetCafeQueryKakaoDto } from './dto/get-cafe-query-kakao.dto';
import { KakaoService } from './kakao.service';

@Controller('kakao-place')
export class KakaoController {
  constructor(private readonly kakaoService: KakaoService) {}

  @UseGuards(JwtAuthGuard)
  @Get('cafe')
  async getCafe(@Query() query: GetCafeQueryKakaoDto) {
    return this.kakaoService.getCafe(query);
  }
}
