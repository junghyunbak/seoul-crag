import { Controller, Get, UseGuards, Req } from '@nestjs/common';

import { UserService } from './user.service';

import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

import { type Request } from 'express';

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
    return req.user;
  }
}
