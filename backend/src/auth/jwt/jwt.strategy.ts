import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { type AppConfig } from 'src/config/env.validation';

import { type Request } from 'express';

import { ACCESS_TOKEN_COOKIE_NAME } from 'src/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService<AppConfig, true>) {
    const jwtFromRequest = ExtractJwt.fromExtractors<Request>([
      (req) => {
        const accessToken: unknown = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

        return typeof accessToken === 'string' ? accessToken : '';
      },
    ]);

    const jwtSecret = config.get('JWT_SECRET', { infer: true });

    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
