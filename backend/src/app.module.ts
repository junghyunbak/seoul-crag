import { Module } from '@nestjs/common';

import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ServeStaticModule } from '@nestjs/serve-static';

import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
