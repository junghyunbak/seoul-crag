import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { envValidationSchema } from 'src/config/env.validation';

import { GymsModule } from 'src/gyms/gyms.module';
import { GymImagesModule } from 'src/gym-images/gym-images.module';
import { GymScheduleModule } from 'src/gym-schedules/gym-schedules.module';
import { GymOpeningHoursModule } from 'src/gym-opening-hours/gym-opening-hours.module';
import { ImageModule } from 'src/image/image-module';
import { CommentsModule } from 'src/comments/comments.module';
import { GymTagsModule } from 'src/gym-tags/gym-tags.module';
import { TagsModule } from 'src/tags/tags.module';
import { ContributionModule } from 'src/contributions/contribution.module';
import { GymUserContributionModule } from 'src/gym-user-contributions/gym-user-contributions.module';
import { FeedsModule } from 'src/feeds/feeds.module';
import { GymDiscountsModule } from 'src/gym-discounts/gym-discounts.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { UserRoleModule } from 'src/user-role/user-role.module';
import { AppVisitedModule } from 'src/app-visited/app-visited.module';
import { NoticeModule } from 'src/notices/notice.module';
import { KakaoModule } from 'src/kakao/kakao.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfig),

    AuthModule,
    UserModule,
    UserRoleModule,
    RoleModule,
    KakaoModule,
    NoticeModule,
    AppVisitedModule,
    GymsModule,
    GymImagesModule,
    GymScheduleModule,
    GymOpeningHoursModule,
    GymTagsModule,
    TagsModule,
    ImageModule,
    CommentsModule,
    ContributionModule,
    GymUserContributionModule,
    GymDiscountsModule,
    FeedsModule,
  ],
})
export class CommonModule {}
