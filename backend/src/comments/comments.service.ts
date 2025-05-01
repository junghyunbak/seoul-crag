import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comments.entity';
import { Gym } from '../gyms/gyms.entity';
import { JwtParsedUser } from 'src/types/auth';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Gym)
    private readonly gymRepo: Repository<Gym>,
    private readonly userService: UserService,
  ) {}

  async isAdminOfGym(jwtParsedUser: JwtParsedUser): Promise<boolean> {
    // TODO: 실제 관리자 권한을 확인하는 로직을 작성
    return jwtParsedUser.roles.some((role) => role.name === 'owner');
  }

  async create(
    jwtParsedUser: JwtParsedUser,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.userService.getUser(jwtParsedUser.id);
    const gym = await this.gymRepo.findOne({ where: { id: dto.gymId } });

    if (!gym || !user) {
      throw new BadRequestException('사용자 또는 암장을 찾을 수 없습니다.');
    }

    const comment = this.commentRepo.create({
      content: dto.content,
      is_admin_only: dto.isAdminOnly ?? false,
      user,
      gym,
    });

    return this.commentRepo.save(comment);
  }

  async findByGym(
    gymId: string,
    jwtParsedUser?: JwtParsedUser,
  ): Promise<Comment[]> {
    const isAdmin = jwtParsedUser
      ? await this.isAdminOfGym(jwtParsedUser)
      : false;

    const where = isAdmin
      ? { gym: { id: gymId } }
      : {
          gym: { id: gymId },
          isAdminOnly: false,
        };

    const comments = await this.commentRepo.find({
      where,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return comments.map((comment) => ({
      ...comment,
      content:
        !isAdmin && comment.is_admin_only
          ? '관리자만 볼 수 있는 댓글입니다.'
          : comment.content,
    }));
  }
  async delete(commentId: string, jwtParsedUser: JwtParsedUser): Promise<void> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user', 'gym'],
    });

    if (!comment) {
      throw new BadRequestException('댓글을 찾을 수 없습니다.');
    }

    const isAuthor = comment.user.id === jwtParsedUser.id;
    const isAdmin = await this.isAdminOfGym(jwtParsedUser);

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('댓글 삭제 권한이 없습니다.');
    }

    await this.commentRepo.softDelete(commentId);
  }
}
