import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import type { Request, Response } from 'express';

import { AuthGuard } from '@nestjs/passport';

import { type AppConfig } from 'src/config/env.validation';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from 'src/constants';

import * as ms from 'ms';

import { JwtParsedUser } from 'src/types/auth';
import { isPassportUser } from 'src/utils/typeguard';

const accessTokenExpires: ms.StringValue = '15m';
const refreshTokenExpires: ms.StringValue = '14d';

// [ ]: 서버 시간대
// [ ]: cors
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {}

  // 🔽️🔽️🔽️🔽️🔽️🔽️🔽️🔽️🔽️

  @Get('kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  async kakaoRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.user || !isPassportUser(req.user)) {
        throw new Error('로그인에 실패하였습니다.');
      }

      const user = await this.userService.findOrCreate(req.user);

      const accessToken = await this.authService.generateJwt(
        user,
        accessTokenExpires,
      );

      const refreshToken = await this.authService.generateJwt(
        user,
        refreshTokenExpires,
      );

      const isProd =
        this.configService.get('NODE_ENV', { infer: true }) === 'prod';

      res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: isProd,
        maxAge: ms(accessTokenExpires),
        sameSite: 'lax',
      });

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: isProd,
        maxAge: ms(refreshTokenExpires),
        sameSite: 'lax',
      });

      await this.userService.setRefreshToken(user.id, refreshToken);
    } catch (err) {
      console.error(err);

      return res.redirect('/login-fail');
    }

    return res.redirect('/?menu=1');
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken: unknown = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (typeof refreshToken === 'string') {
      try {
        const payload = this.jwtService.verify<JwtParsedUser>(refreshToken);

        await this.userService.removeRefreshToken(payload.id);
      } catch (err) {
        console.error('로그아웃 중 토큰 관련 에러 발생', err);
      }
    }

    const isProd =
      this.configService.get('NODE_ENV', { infer: true }) === 'prod';

    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
    });

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
    });

    return res.send({ success: true });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken: unknown = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }

    let payload: JwtParsedUser | null = null;

    try {
      payload = this.jwtService.verify<JwtParsedUser>(refreshToken);
    } catch (err) {
      console.error(err);

      throw new UnauthorizedException('유효하지 않는 토큰입니다');
    }

    const user = await this.userService.getUser(payload.id);

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const isValid = await this.userService.validateRefreshToken(
      user.id,
      refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const newAccessToken = await this.authService.generateJwt(
      user,
      accessTokenExpires,
    );

    const newRefreshToken = await this.authService.generateJwt(
      user,
      refreshTokenExpires,
    );

    const isProd =
      this.configService.get('NODE_ENV', { infer: true }) === 'prod';

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, newAccessToken, {
      httpOnly: true,
      secure: isProd,
      maxAge: ms(accessTokenExpires),
      sameSite: 'lax',
    });

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      maxAge: ms(refreshTokenExpires),
      sameSite: 'lax',
    });

    await this.userService.setRefreshToken(user.id, newRefreshToken);

    return res.send({ success: true });
  }
}
