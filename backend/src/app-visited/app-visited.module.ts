import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppVisited } from './app-visited.entity';
import { AppVisitedController } from './app-visited.controller';
import { AppVisitedService } from './app-visited.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppVisited])],
  controllers: [AppVisitedController],
  providers: [AppVisitedService],
})
export class AppVisitedModule {}
