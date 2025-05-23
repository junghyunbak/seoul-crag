import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { UserV2Controller } from './user.v2.controller';
import { UserV2Service } from './user.v2.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserV2Service],
  controllers: [UserController, UserV2Controller],
  exports: [UserService],
})
export class UserModule {}
