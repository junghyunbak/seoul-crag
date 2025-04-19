import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

import { envValidationSchema } from 'src/config/env.validation';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { RoleModule } from 'src/role/role.module';
import { UserRoleModule } from 'src/user-role/user-role.module';
import { GymsModule } from 'src/gyms/gyms.module';
import { GymImagesModule } from 'src/gym-images/gym-images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    AuthModule,
    UserModule,
    RoleModule,
    UserRoleModule,
    GymsModule,
    GymImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
