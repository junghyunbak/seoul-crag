import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async getUser(userId: string): Promise<User | null> {
    const user = await this.users.findOneBy({ id: userId });

    return user;
  }

  async findOrCreate(user: UserInfo): Promise<User> {
    const { provider, provider_id, email, username, profile_image } = user;

    const existing = await this.users.findOne({
      where: { provider, provider_id },
    });

    if (existing) {
      return existing;
    }

    const newUser = this.users.create({
      provider,
      provider_id,
      email,
      username,
      profile_image,
    });

    return await this.users.save(newUser);
  }

  async getAllUsersWithRoles() {
    const users = await this.users.find({
      relations: ['userRoles', 'userRoles.role'],
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      roles: user.userRoles.map((ur) => ur.role),
    }));
  }

  async setRefreshToken(userId: string, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);

    await this.users.update(userId, {
      refresh_token_hash: hashedToken,
    });
  }

  async removeRefreshToken(userId: string) {
    await this.users.update(userId, {
      refresh_token_hash: '',
    });
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.users.findOneBy({ id: userId });

    if (!user || !user.refresh_token_hash) {
      return false;
    }

    return bcrypt.compare(refreshToken, user.refresh_token_hash);
  }
}
