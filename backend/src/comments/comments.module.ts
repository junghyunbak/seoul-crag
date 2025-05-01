import { Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import { CommentsService } from 'src/comments/comments.service';
import { CommentsController } from 'src/comments/comments.controller';

@Module({
  imports: [UserModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
