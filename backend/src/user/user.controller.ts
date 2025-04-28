import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  Patch,
  Body,
} from '@nestjs/common';

import { UserService } from './user.service';

import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

import { type Request } from 'express';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

// [ ]: JwtAuthGuard와 카카오 로그인 시 전달되는 req.user의 타입이 달라 생기는 방어코드 제거
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAllUsersWithRoles() {
    return this.userService.getAllUsersWithRoles();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const { user } = req;

    if (!user || !('id' in user) || typeof user.id !== 'string') {
      throw new UnauthorizedException('');
    }

    return this.userService.getUserWithRoles(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser(@Req() req: Request, @Body() userInfo: UpdateUserDto) {
    const { user } = req;

    if (!user || !('id' in user) || typeof user.id !== 'string') {
      throw new UnauthorizedException('');
    }

    return this.userService.updateUser(user.id, userInfo);
  }
}
