import { Controller, Post, Req, Body, UseGuards, Get } from '@nestjs/common';
import { AppVisitedService } from './app-visited.service';
import { Request } from 'express';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { isJwtParsedUser } from 'src/utils/typeguard';

@Controller('visit')
export class AppVisitedController {
  constructor(private readonly appVisitedService: AppVisitedService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async visit(@Req() req: Request, @Body() body: { url: string }) {
    const ip =
      (req.headers['x-forwarded-for'] as string) ??
      req.socket.remoteAddress ??
      '';

    const userId = (() => {
      if (req.user && isJwtParsedUser(req.user)) {
        return req.user.id;
      }

      return null;
    })();

    await this.appVisitedService.logVisit(userId, ip, body.url);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getVisitStats() {
    return await this.appVisitedService.getVisitStats();
  }
}
