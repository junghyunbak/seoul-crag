import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRole } from 'src/user-role/user-role.entity';
import { UserRoleService } from 'src/user-role/user-role.service';
import { UserRoleController } from 'src/user-role/user-role.controller';

import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Role } from 'src/role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, User, Role]), UserModule],
  providers: [UserRoleService],
  controllers: [UserRoleController],
  exports: [UserRoleService],
})
export class UserRoleModule {}
