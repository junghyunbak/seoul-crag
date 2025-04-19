import { forwardRef, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

import { KakaoStrategy } from 'src/auth/kakao/kakao.strategy';

import { UserModule } from 'src/user/user.module';
import { UserRoleModule } from 'src/user-role/user-role.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    forwardRef(() => UserRoleModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
