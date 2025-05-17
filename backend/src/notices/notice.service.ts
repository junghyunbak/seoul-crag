import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './notice.entity';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepo: Repository<Notice>,
  ) {}

  async findAll(visible: boolean | undefined): Promise<Notice[]> {
    return this.noticeRepo.find({
      where: { visible },
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notice | null> {
    return this.noticeRepo.findOneBy({ id });
  }

  async create(dto: CreateNoticeDto): Promise<Notice> {
    const notice = this.noticeRepo.create(dto);
    return this.noticeRepo.save(notice);
  }

  async update(id: string, dto: UpdateNoticeDto): Promise<Notice | null> {
    await this.noticeRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.noticeRepo.delete(id);
  }
}
