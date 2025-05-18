import { Controller, Post, Req, Body, UseGuards, Get } from '@nestjs/common';
import { AppVisitedService } from './app-visited.service';
import { Request } from 'express';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { isJwtParsedUser } from 'src/utils/typeguard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateAppVisitedDto } from './dto/create-app-visited.dto';

@Controller('visit')
export class AppVisitedController {
  constructor(private readonly appVisitedService: AppVisitedService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async visit(@Req() req: Request, @Body() body: CreateAppVisitedDto) {
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

    await this.appVisitedService.logVisit(userId, ip, body);
  }

  @Roles('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getVisitStats() {
    return await this.appVisitedService.getRecentVisitedStats();
  }

  @Roles('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/hourly')
  async getHourlyVisitStats() {
    return this.appVisitedService.getHourlyStats24h();
  }
}
