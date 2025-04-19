import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/env.validation';

export const TypeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService<AppConfig, true>) => {
    const nodeEnv = config.get<AppConfig['NODE_ENV']>('NODE_ENV');

    return {
      type: 'postgres',
      url: config.get('DATABASE_URL'),
      autoLoadEntities: true,
      synchronize: nodeEnv !== 'production',
      logging: nodeEnv === 'development',
    };
  },
};
