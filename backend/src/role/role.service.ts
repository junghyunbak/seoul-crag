import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { DEFAULT_ROLES } from './role.entity';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  async seedRoles() {
    for (const name of DEFAULT_ROLES) {
      const exists = await this.roleRepo.findOne({ where: { name } });

      if (!exists) {
        const role = this.roleRepo.create({ name });
        await this.roleRepo.save(role);
      }
    }
  }

  async findAll() {
    const roles = await this.roleRepo.find();

    return roles.filter((role) => role.name !== 'owner');
  }
}
