import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';
import { isJwtParsedUser } from 'src/utils/typeguard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  /**
   * 댓글 작성
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateCommentDto) {
    const user = req.user;

    if (!user || !isJwtParsedUser(user)) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    return this.commentService.create(user, dto);
  }

  /**
   * 특정 암장의 댓글 목록 조회
   */
  @UseGuards(JwtAuthGuard)
  @Get('gym/:gymId')
  async findByGym(
    @Param('gymId', ParseUUIDPipe) gymId: string,
    @Req() req: Request,
  ) {
    const user = req.user;

    return this.commentService.findByGym(
      gymId,
      user && isJwtParsedUser(user) ? user : undefined,
    );
  }

  /**
   * 댓글 삭제
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async delete(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Req() req: Request,
  ) {
    const user = req.user;

    if (!user || !isJwtParsedUser(user)) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    return this.commentService.delete(commentId, user);
  }
}
