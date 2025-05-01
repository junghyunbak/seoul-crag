import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { User } from 'src/user/user.entity';
import { UserRoleService } from 'src/user-role/user-role.service';

import * as ms from 'ms';

import { JwtParsedUser } from 'src/types/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async generateJwt(user: User, expiresIn: ms.StringValue): Promise<string> {
    const roles = await this.userRoleService.getRolesOfUser(user.id);

    const payload: JwtParsedUser = {
      id: user.id,
      username: user.username,
      provider: user.provider,
      roles,
    };

    return this.jwtService.signAsync(payload, { expiresIn });
  }
}
