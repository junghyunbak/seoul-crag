import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/env.validation';
import { GetCafeQueryKakaoDto } from './dto/get-cafe-query-kakao.dto';
import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoService {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  async getCafe(query: GetCafeQueryKakaoDto) {
    const { lat, lng, radius } = query;

    const url = `https://dapi.kakao.com/v2/local/search/category?category_group_code=CE7&radius=${radius}&x=${lng}&y=${lat}`;

    const headers = {
      Authorization: `KakaoAK ${this.configService.get('KAKAO_REST_API_KEY')}`,
    };

    try {
      const { data } = await axios.get(url, { headers });

      return data;
    } catch (error) {
      console.error('Error fetching data from Kakao API:', error);

      throw new Error('Failed to fetch data from Kakao API');
    }
  }
}
