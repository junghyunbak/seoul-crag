import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  Patch,
  Body,
  Param,
} from '@nestjs/common';

import { UserService } from './user.service';

import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

import { type Request } from 'express';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

import { isJwtParsedUser } from 'src/utils/typeguard';

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

    if (!user || !isJwtParsedUser(user)) {
      throw new UnauthorizedException('로그인 되어있지 않습니다.');
    }

    return this.userService.getUserWithRoles(user.id);
  }

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    const user = await this.userService.getUserWithContribution(userId);

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser(@Req() req: Request, @Body() userInfo: UpdateUserDto) {
    const { user } = req;

    if (!user || !isJwtParsedUser(user)) {
      throw new UnauthorizedException('로그인 되어있지 않습니다.');
    }

    return this.userService.updateUser(user.id, userInfo);
  }
}
