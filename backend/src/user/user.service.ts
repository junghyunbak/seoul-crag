import { Injectable, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUser(userId: string): Promise<User | null> {
    const user = await this.userRepo.findOneBy({ id: userId });

    return user;
  }

  async getUserWithRoles(userId: string) {
    const user = await this.userRepo.findOne({
      relations: ['userRoles', 'userRoles.role'],
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      username: user?.username,
      profile_image: user.profile_image,
      email: user.email,
      created_at: user.created_at,
      roles: user.userRoles.map((ur) => ur.role),
    };
  }

  async getAllUsersWithRoles() {
    const users = await this.userRepo.find({
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

  async findOrCreate(user: UserInfo): Promise<User> {
    const { provider, provider_id, email, username, profile_image } = user;

    const existing = await this.userRepo.findOne({
      where: { provider, provider_id },
    });

    if (existing) {
      return existing;
    }

    const newUser = this.userRepo.create({
      provider,
      provider_id,
      email,
      username,
      profile_image,
    });

    return await this.userRepo.save(newUser);
  }

  async setRefreshToken(userId: string, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);

    await this.userRepo.update(userId, {
      refresh_token_hash: hashedToken,
    });
  }

  async removeRefreshToken(userId: string) {
    await this.userRepo.update(userId, {
      refresh_token_hash: '',
    });
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user || !user.refresh_token_hash) {
      return false;
    }

    return bcrypt.compare(refreshToken, user.refresh_token_hash);
  }
}
