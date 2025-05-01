import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
import { GymScheduleModule } from 'src/gym-schedules/gym-schedules.module';
import { GymOpeningHoursModule } from 'src/gym-opening-hours/gym-opening-hours.module';
import { ImageModule } from 'src/image/image-module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UserModule,
    RoleModule,
    UserRoleModule,
    GymsModule,
    GymImagesModule,
    GymScheduleModule,
    GymOpeningHoursModule,
    ImageModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
