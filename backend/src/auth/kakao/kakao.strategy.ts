import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from 'passport-oauth2';

import { Strategy, type Profile } from 'passport-kakao';
import { KakaoRawProfileSchema } from 'src/auth/kakao/kakao.schema';

import { AppConfig } from 'src/config/env.validation';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private configService: ConfigService<AppConfig, true>) {
    const clientID = configService.get('KAKAO_CLIENT_ID', { infer: true });
    const callbackURL = configService.get('KAKAO_REDIRECT_URI', {
      infer: true,
    });

    super({
      clientID,
      callbackURL,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id } = profile;

    try {
      const json = KakaoRawProfileSchema.parse(profile._json);

      const user: UserInfo = {
        provider: 'kakao',
        provider_id: id,
        username: json.properties?.nickname || '익명의 클라이머',
        email: json.kakao_account?.email,
        profile_image: json.properties?.profile_image,
      };

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
