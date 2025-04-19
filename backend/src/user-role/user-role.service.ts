import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/role/role.entity';
import { User } from 'src/user/user.entity';
import { UserRole } from './user-role.entity';

import { UserService } from 'src/user/user.service';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserRole)
    private userRoleRepo: Repository<UserRole>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async getRolesOfUser(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRoles = await this.userRoleRepo.find({
      where: { user: { id: user.id } },
      relations: ['role'],
    });

    return userRoles.map((ur) => ur.role);
  }

  async addRoleToUser(userId: string, roleId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepo.findOneBy({ id: roleId });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const exists = await this.userRoleRepo.findOne({
      where: { user: { id: userId }, role: { id: roleId } },
    });

    if (exists) {
      throw new BadRequestException('User already has this role');
    }

    const userRole = this.userRoleRepo.create({ user, role });

    const savedUserRole = await this.userRoleRepo.save(userRole);

    await this.userService.removeRefreshToken(userId);

    return savedUserRole;
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    const result = await this.userRoleRepo.delete({
      user: { id: userId },
      role: { id: roleId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Role not assigned to user');
    }

    await this.userService.removeRefreshToken(userId);
  }
}
