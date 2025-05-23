import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type Request } from 'express';
import { UserV2Service } from './user.v2.service';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { isJwtParsedUser } from 'src/utils/typeguard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('v2/users')
export class UserV2Controller {
  constructor(private readonly userService: UserV2Service) {}

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();

    return users?.map((user) => new UserResponseDto({ ...user }));
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const { user } = req;

    if (!user || !isJwtParsedUser(user)) {
      throw new UnauthorizedException('로그인 되어있지 않습니다.');
    }

    return this.userService.getUser(user.id);
  }

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    const user = await this.userService.getUser(userId);

    return new UserResponseDto({
      ...user,
    });
  }
}
