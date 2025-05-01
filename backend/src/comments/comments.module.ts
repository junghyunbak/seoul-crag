import { Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import { CommentsService } from 'src/comments/comments.service';
import { CommentsController } from 'src/comments/comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comments/comments.entity';
import { Gym } from 'src/gyms/gyms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Gym]), UserModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
