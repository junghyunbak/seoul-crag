import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';

import { UserV2Service } from './user.v2.service';
import { UserResponseDto } from './dto/user-response.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('v2/users')
export class UserV2Controller {
  constructor(private readonly userService: UserV2Service) {}

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    const user = await this.userService.getUser(userId);

    return new UserResponseDto({
      ...user,
    });
  }

  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();

    return users?.map((user) => new UserResponseDto({ ...user }));
  }
}
